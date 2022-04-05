import React from "react";
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Form } from "./Form";

function App() {
  return (
    <ChakraProvider>
      <Box
        as="section"
        bg="bg-surface"
        pt={{ base: "4", md: "8" }}
        pb={{ base: "12", md: "24" }}
      >
        <Container>
          <Stack spacing="1" my={5}>
            <Heading
              size={useBreakpointValue({ base: "xs", md: "sm" })}
              fontWeight="medium"
            >
              GeoJson converter
            </Heading>
            <Text color="muted">
              insert location and you will see how the GeoJson Renders
            </Text>
          </Stack>
          <Form />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
