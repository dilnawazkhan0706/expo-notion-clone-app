import { baseClient, extendedClient } from "@/mydbModule";
import { NotionFile } from "@prisma/client/react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import DraggableNotionListItem from "./DraggableNotionListItem";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import RecentFiles from "./RecentFiles";

const DraggableNotionList = () => {
  const [sortedFiles, setSortedFiles] = useState<NotionFile[]>([]);
  const files = extendedClient.notionFile.useFindMany({
    where: {
      parentFile: {
        is: null,
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  useEffect(() => {
    setSortedFiles(files);
  }, [files]);

  const handleDragEnd = async (data: NotionFile[]) => {
    setSortedFiles(data);
    //? todo => sort files => update db
    const updates = data.map((file, index) => {
      return baseClient.notionFile.update({
        where: {
          id: file.id,
        },
        data: { order: index },
      });
    });
    await baseClient.$transaction(updates);
    await extendedClient.$refreshSubscriptions();
  };

  return (
    <DraggableFlatList
      data={sortedFiles}
      containerStyle={{ flex: 1 }}
      onDragEnd={({ data }) => handleDragEnd(data)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={DraggableNotionListItem}
      ListHeaderComponent={() => (
        <>
          <RecentFiles />
          <View
            style={{
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ThemedText type="defaultSemiBold">Private Files</ThemedText>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="arrow-up" color={"grey"} size={15} />
              <Ionicons name="arrow-down" color={"grey"} size={15} />
            </TouchableOpacity>
          </View>
          {!sortedFiles.length && (
            <ThemedText
              style={{ color: "grey", textAlign: "center", paddingTop: 12 }}
            >
              Nothing to show!
            </ThemedText>
          )}
        </>
      )}
    />
  );
};

export default DraggableNotionList;
