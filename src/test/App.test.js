import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "../components/TodoList.jsx";

import React from "react";

describe("TodoList", () => {
  test("renders the TodoList component", () => {
    render(<TodoList />);
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  test("can add a new task", () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), {
      target: { value: "Test Task" },
    });
    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("does not add an empty task", () => {
    render(<TodoList />);

    // Contamos cuántas tareas hay inicialmente
    const initialTaskCount = screen.queryAllByRole("listitem").length;

    // Intentamos agregar una tarea vacía
    fireEvent.change(screen.getByPlaceholderText("Add a task"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Add"));

    // Verificamos que la cantidad de tareas siga siendo la misma
    const finalTaskCount = screen.queryAllByRole("listitem").length;
    expect(finalTaskCount).toBe(initialTaskCount);
  });

  test("can mark a task as complete", () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), {
      target: { value: "Complete Task" },
    });
    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Complete"));
    const task = screen.getByText("Complete Task");
    expect(task).toHaveStyle("text-decoration: line-through");
  });

  test("can undo a completed task", () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), {
      target: { value: "Undo Task" },
    });
    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Complete"));
    fireEvent.click(screen.getByText("Undo"));
    const task = screen.getByText("Undo Task");
    expect(task).toHaveStyle("text-decoration: none");
  });

  test("can delete a task", () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), {
      target: { value: "Delete Task" },
    });
    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Delete Task")).not.toBeInTheDocument();
  });

  test("input is cleared after adding a task", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a task");
    fireEvent.change(input, { target: { value: "Clear Input Task" } });
    fireEvent.click(screen.getByText("Add"));

    expect(input.value).toBe("");
  });
});
