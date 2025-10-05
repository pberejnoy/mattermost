import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

export default function MattermostView() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Добавляем обработчик сообщений от Mattermost
    const handleMessage = (event) => {
      if (event.origin === 'http://localhost:8065') {
        // Обрабатываем сообщения от Mattermost
        console.log('Получено сообщение от Mattermost:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Box height="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <iframe
        ref={iframeRef}
        src="http://localhost:8065"
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="Mattermost"
      />
    </Box>
  );
}