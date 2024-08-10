import { ComponentProps } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

interface NotionButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
}

const NotionButton = ({
  onPress,
  title,
  iconName,
  containerStyle,
}: NotionButtonProps) => {
  const theme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: Colors[theme!].backgroundSecondary,
          borderRadius: title ? 6 : 40,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      {iconName && (
        <Ionicons name={iconName} size={16} color={Colors[theme!].text} />
      )}
      {title && (
        <ThemedText
          darkColor="white"
          lightColor="black"
          style={{ fontSize: 14, lineHeight: 0, fontWeight: "600" }}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

export default NotionButton;

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
