import {
  Box,
  Grid,
  GridItem,
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react';
import Header from '../components/Header';
import ServerCard from '../components/ServerCard';
import MattermostView from '../components/MattermostView';
import CodeChangeViewer from '../components/CodeChangeViewer';

export default function Dashboard() {
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bg}>
      <Header />
      <Grid
        templateColumns="repeat(12, 1fr)"
        gap={4}
        p={4}
        h="calc(100vh - 64px)"
      >
        {/* Боковая панель с серверами */}
        <GridItem colSpan={3}>
          <Box>
            <ServerCard
              server={{
                name: 'GitHub MCP Server',
                endpoint: 'http://localhost:3000',
                statusEndpoint: '/github/status'
              }}
            />
            <Box mt={4}>
              <ServerCard
                server={{
                  name: 'PostgreSQL MCP Server',
                  endpoint: 'http://localhost:3001',
                  statusEndpoint: '/db/status'
                }}
              />
            </Box>
            <Box mt={4}>
              <ServerCard
                server={{
                  name: 'Docker MCP Server',
                  endpoint: 'http://localhost:3002',
                  statusEndpoint: '/docker/status'
                }}
              />
            </Box>
          </Box>
        </GridItem>

        {/* Основная область с Mattermost и изменениями кода */}
        <GridItem colSpan={9}>
          <Tabs isLazy height="100%">
            <TabList>
              <Tab>Mattermost</Tab>
              <Tab>Изменения в коде</Tab>
            </TabList>
            <TabPanels height="calc(100% - 40px)">
              <TabPanel height="100%">
                <MattermostView />
              </TabPanel>
              <TabPanel height="100%">
                <CodeChangeViewer />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Box>
  );
}