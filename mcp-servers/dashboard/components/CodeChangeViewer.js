import { Box, Text, Code, VStack, HStack, Badge } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function CodeChangeViewer() {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    // Функция для отслеживания изменений в файлах
    const watchFiles = async () => {
      try {
        // Подключаемся к WebSocket серверу для получения изменений
        const ws = new WebSocket('ws://localhost:3000/changes');

        ws.onmessage = (event) => {
          const change = JSON.parse(event.data);
          setChanges(prev => [change, ...prev].slice(0, 50)); // Храним последние 50 изменений
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        return () => ws.close();
      } catch (error) {
        console.error('Error watching files:', error);
      }
    };

    watchFiles();
  }, []);

  return (
    <Box height="100%" overflowY="auto" p={4}>
      <VStack spacing={4} align="stretch">
        {changes.map((change, index) => (
          <Box 
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            shadow="sm"
          >
            <HStack spacing={4} mb={2}>
              <Text fontWeight="bold">{change.file}</Text>
              <Badge colorScheme={change.type === 'add' ? 'green' : change.type === 'modify' ? 'yellow' : 'red'}>
                {change.type}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {new Date(change.timestamp).toLocaleTimeString()}
              </Text>
            </HStack>
            {change.diff && (
              <Code p={2} borderRadius="md" whiteSpace="pre">
                {change.diff}
              </Code>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}