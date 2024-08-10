import { Button, SafeAreaView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { extendedClient } from "@/mydbModule";
import { NotionFile } from "@prisma/client/react-native";
import DraggableNotionList from "@/components/DraggableNotionList";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const USER_ID = 1;

export default function HomeScreen() {
  const user = extendedClient.user.useFindFirst({
    where: {
      id: USER_ID,
    },
  });

  //find where id is something
  const notion = extendedClient.notionFile.useFindFirst({
    where: {
      authorId: USER_ID,
    },
  });

  //fetch all the data

  const allNotions = extendedClient.notionFile.useFindMany();

  const createUser = () => {
    const newUser = { name: "Dilnawaz Khan", email: "dilnawaz@expo.dev" };
    extendedClient.user.create({
      data: newUser,
    });
    console.log("User created successfully");
  };

  const createNotion = () => {
    const newNotion = {
      authorId: 1,
      title: "Test title",
      content: "example content",
      icon: "🥳",
      description: "",
      coverPhoto: "",
      type: "default",
    };

    extendedClient.notionFile.create({
      data: newNotion,
    });
    console.log("notion created successfully");
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <DraggableNotionList />
        {/* <Button title="Create a user" onPress={createUser} /> */}
        {/* <Button title="Create a notion" onPress={createNotion} /> */}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
