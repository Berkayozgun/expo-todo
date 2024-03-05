import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  axios.defaults.baseURL = "http://192.168.1.16:5000";

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get("/todos");
        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      console.error("Todo title cannot be empty");
      return;
    }

    try {
      const response = await axios.post("/todos", { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error.response.data.error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await axios.delete(`/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo._id !== todoId));
      console.log("ToDo silindi:", response.data);
    } catch (error) {
      console.error("Error deleting todo:", error.response.data.error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "80%" }}>
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          Yapılacaklar Listesi
        </Text>

        <View style={{ flexDirection: "row", marginTop: "40%" }}>
          {/* ToDo Ekleme Form */}
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginRight: 10,
            }}
            placeholder="Yeni ToDo Ekle"
            value={newTodo}
            onChangeText={(text) => setNewTodo(text)}
            onSubmitEditing={addTodo}
          />
          <Button
            title="Ekle"
            onPress={addTodo}
            style={{
              borderRadius: 5,
              boxShadow: "0 0 5px 0 rgba(0,0,0,0.5)",
            }}
          />
        </View>

        {/* ToDo List */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  padding: 5,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 0 5px 0 rgba(0,0,0,0.5)",
                }}
                onPress={() => deleteTodo(item._id)}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, marginLeft: "5%" }}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
