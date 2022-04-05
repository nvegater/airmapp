import React from "react";
import { render, screen } from "@testing-library/react";
import { Form } from "./Form";

describe("Form", () => {
  test("renders Form component", () => {
    render(<Form />);
    screen.debug();
  });
});
