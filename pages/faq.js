import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function FAQ() {
  return (
    <ScrollView contentContainerStyle={{ padding: 40 }}>
      <View style={styles.container}>
        <Text role="header" style={styles.pageTitle}>
          Frequently Asked Questions
        </Text>
        <Text style={styles.sectionText}>Last updated December 17th, 2023</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Where is the email I just sent myself?</Text>
        <Text style={styles.sectionText}>
          Check your spam folder! After a few minutes if it's still not there, try again. Sending a
          new link invalidates previous ones.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Can I get past the sign in screen?</Text>
        <Text style={styles.sectionText}>
          The only way is by sending yourself a link using a valid email. Tapping the link from your
          email will send you back to the app where you may be asked to create a profile if you have
          not done so already. After creating your profile, you will return to the home screen.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What if I delete the app off my phone?</Text>
        <Text style={styles.sectionText}>
          Lyrist supports cloud storage so you can access your data from any device.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How can I close my account?</Text>
        <Text style={styles.sectionText}>
          To close your account and delete your data permanently, email us at{" "}
          <Text
            role="link"
            href={"mailto:lyrist.app@gmail.com"}
            style={[styles.text, { textDecorationLine: "underline" }]}
          >
            lyrist.app@gmail.com
          </Text>
          . After you close your account, we email you a link which you can use to reactivate it
          within 7 days. After those 7 days, your account cannot be reactivated and the process to
          delete your data will be initiated. You can always create a new one. Note: You can use the
          same email address to create a new account after 14 days from the date of closing your
          account.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I have another question not answered here.</Text>
        <Text style={styles.sectionText}>
          If you have feedback or additional questions, please contact us at{" "}
          <Text
            role="link"
            href={"mailto:lyrist.app@gmail.com"}
            style={[styles.text, { textDecorationLine: "underline" }]}
          >
            lyrist.app@gmail.com
          </Text>
          .
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 24,
  },
  pageTitle: {
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Fira Sans",
    fontSize: 24,
  },
  section: {
    paddingTop: 24,
  },
  sectionText: {
    fontFamily: "Fira Sans",
  },
  sectionTitle: {
    fontFamily: "Fira Sans",
    fontWeight: 600,
  },
});
