import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { NotionFile } from "@prisma/client/react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { extendedClient } from "@/mydbModule";
import { Colors } from "@/constants/Colors";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Link } from "expo-router";

const DraggableNotionListItem = ({
  drag,
  isActive,
  item,
}: RenderItemParams<NotionFile>) => {
  return (
    <NotifileFileItem
      drag={drag}
      isActive={isActive}
      notionFile={item}
      iconColor="grey"
    />
  );
};

export default DraggableNotionListItem;

interface InnerNotionListItemProps {
  parentId: number | undefined;
}

function InnerNotionListItem({ parentId }: InnerNotionListItemProps) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "light" ? Colors.light.icon : Colors.dark.icon;
  const childs = extendedClient.notionFile.useFindMany({
    where: {
      parentFileId: parentId,
    },
  });

  if (!childs.length)
    return <ThemedText style={{ color: "grey" }}>No Pages Inside!</ThemedText>;

  return (
    <View>
      {childs.map((notionFile: NotionFile) => (
        <NotifileFileItem
          key={notionFile.id}
          iconColor={iconColor}
          notionFile={notionFile}
        />
      ))}
    </View>
  );
}

interface NotifileFileItemProps {
  drag?: () => void;
  isActive?: boolean;
  notionFile: NotionFile;
  iconColor: string;
}

function NotifileFileItem({
  iconColor,
  isActive,
  notionFile,
  drag,
}: NotifileFileItemProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isOpen, setIsOpen] = useState(false);

  const onPress = (id: number) => {
    const options = ["Delete", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case destructiveButtonIndex: {
            extendedClient.notionFile.delete({
              where: {
                id,
              },
            });
            break;
          }
          case cancelButtonIndex: {
            //handle cancel option if needed
          }
        }
      }
    );
  };

  return (
    <View>
      <Link
        asChild
        push
        href={{
          pathname: "/new-notion",
          params: { viewingFile: JSON.stringify(notionFile) },
        }}
      >
        <TouchableOpacity
          style={styles.heading}
          activeOpacity={0.8}
          disabled={isActive}
          onLongPress={drag}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => setIsOpen((prev) => !prev)}>
              <Ionicons
                name={isOpen ? "chevron-down" : "chevron-forward-outline"}
                size={18}
                style={{ marginRight: 12 }}
                color={iconColor}
              />
            </Pressable>
            <ThemedText type="defaultSemiBold">
              {notionFile.icon} {notionFile.title}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Pressable onPress={() => onPress(notionFile.id)}>
              <Ionicons
                name={"ellipsis-horizontal"}
                size={18}
                color={iconColor}
              />
            </Pressable>
            <Link
              href={{
                pathname: "/new-notion",
                params: { parentId: notionFile.id },
              }}
            >
              <Ionicons name={"add"} size={22} color={iconColor} />
            </Link>
          </View>
        </TouchableOpacity>
      </Link>
      {isOpen ? (
        <View style={styles.content}>
          {/* create notion list inner item */}
          <InnerNotionListItem parentId={notionFile.id} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  content: {
    marginLeft: 24,
  },
});
