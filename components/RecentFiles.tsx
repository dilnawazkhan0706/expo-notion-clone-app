import { extendedClient } from "@/mydbModule";
import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemedText } from "./ThemedText";
import RecentFileCard from "./RecentFileCard";

const RecentFiles = () => {
  const theme = useColorScheme();
  const recentFiles = extendedClient.notionFile.useFindMany({
    orderBy: { updatedAt: "desc" },
    take: 6,
    where: {
      parentFileId: { equals: null },
    },
  });
  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={{ paddingHorizontal: 10 }}>
        Jump Back in
      </ThemedText>
      {!recentFiles.length && (
        <ThemedText
          style={{ color: "gray", textAlign: "center", paddingTop: 12 }}
        >
          Nothing to show!
        </ThemedText>
      )}
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 12, padding: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {recentFiles.map((recentFile) => (
          <RecentFileCard key={recentFile.id} notionFile={recentFile} />
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentFiles;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});
