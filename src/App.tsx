import React from "react";
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import { Form } from "./components/Form";

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
              mb={5}
            >
              Elements in a bounding box
            </Heading>
            <Text
              size={useBreakpointValue({ base: "xs", md: "sm" })}
              marginBottom={"20px"}
            >
              Insert a{" "}
              <Link
                href="https://wiki.openstreetmap.org/wiki/Downloading_data"
                color="teal"
              >
                valid
              </Link>{" "}
              bounding box to see the elements inside of it.
            </Text>
            <Text color="muted">
              To see some examples of valid bounding box coordinates you can use
              the{" "}
              <Link
                href="http://bboxfinder.com/#17.972538,-92.947702,17.979212,-92.938046"
                color="teal"
              >
                Bbox finder
              </Link>{" "}
              or the{" "}
              <Link
                href="https://www.openstreetmap.org/export#map=16/48.4550/15.2550"
                color="teal"
              >
                Open street map export tool.
              </Link>
            </Text>
          </Stack>
          <Form />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
