'use client';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

export function Privacy() {
  return (
    <ScrollView contentContainerStyle={{padding: 40}}>
      <View style={styles.container}>
        <Text role={'header'} style={styles.pageTitle}>
          Privacy Policy
        </Text>
        <Text style={styles.sectionText}>Last updated June 9th, 2022</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionText}>
          Lyrist ("we," "us," or "our") is committed to protecting our users' ("user" or "you")
          privacy. This Privacy Statement describes how we collect, use, disclose, and preserve the
          information you provide when using our mobile application (the "Application"). Please take
          the time to thoroughly read this Privacy Statement. PLEASE DO NOT ACCESS THE APPLICATION
          IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY. We retain the right, at any
          time and for any reason, to modify this Privacy Statement. We will notify you of any
          changes to this Privacy Policy by revising the "Last updated" date at the top of this
          page. You are advised to review our Privacy Statement on a regular basis to ensure that
          you are aware of any changes. By continuing to use the Application after the date on which
          the amended Privacy Policy is posted, you will be deemed to have been made aware of,
          subject to, and accepting the changes in the revised Privacy Policy. This Privacy
          Statement does not apply to the third-party online/mobile store from which you download
          the Application or make payments, including for any in-game virtual items, which may
          collect and use data about you as well. We are not liable for any data acquired by these
          third parties.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COLLECTION OF YOUR INFORMATION</Text>
        <Text style={styles.sectionText}>
          We may gather information about you in a number of different ways. The types of
          information we may collect through the Application vary according to the content and
          resources you use, but may include the following:
        </Text>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Personal Data</Text>
          <Text style={styles.sectionText}>
            Demographic and other personally identifiable information (such as your name and email
            address) that you voluntarily provide to us when engaging in various Application-related
            activities, such as chatting, posting messages in comment sections or on our forums,
            liking posts, sending feedback, and responding to surveys. If you choose to share
            information about yourself via your profile, online chat, or other interactive parts of
            the Application, please be aware that any information you reveal in these places becomes
            public and is accessible to anyone who visits the Application.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Derivative Data</Text>
          <Text style={styles.sectionText}>
            Information that our servers gather automatically when you access the Application, such
            as your native activities, such as liking, re-blogging, or replying to a post, as well
            as other interactions with the Application and other users via server log files.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Financial Data</Text>
          <Text style={styles.sectionText}>
            Financial information, such as credit card numbers, card brands, and expiration dates,
            that we may collect when you purchase, order, return, exchange, or seek information
            about our services through the Application. We store only a small amount, if any, of the
            financial information we gather. Otherwise, our payment processor stores all financial
            information, and you are invited to examine their privacy statement and contact them
            directly with any questions.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Permissions on Facebook</Text>
          <Text style={styles.sectionText}>
            By default, the Application will have access to your Facebook account's basic
            information, such as your name, email address, gender, birthday, current city, and
            profile image URL, as well as any other information you choose to make public. We may
            also seek access to additional permissions associated with your account, such as
            friends, checkins, and likes, and you may give or decline each individual permission.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Social Networking Data</Text>
          <Text style={styles.sectionText}>
            If you connect your account to social networking sites, we may collect information about
            you from those sites, including your name, your social network username, your location,
            gender, birth date, email address, profile picture, and public data for contacts.
            Additionally, this information may include the contact information of anyone you ask to
            use the Application and/or join.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Geo-Location Data</Text>
          <Text style={styles.sectionText}>
            We may seek access or permission to and track location-based information from your
            mobile device in order to provide location-based services, either constantly or when you
            are using the Application. If you wish to modify our access or permissions, you may do
            so through the settings menu on your device.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Access through Mobile Device</Text>
          <Text style={styles.sectionText}>
            We may request access to or authorization to certain capabilities on your mobile device,
            including (Bluetooth, calendar, camera, contacts, microphone, reminders, sensors, SMS
            messages, social media accounts, and storage.) If you wish to modify our access or
            permissions, you may do so through the settings menu on your device.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Data from Mobile Devices</Text>
          <Text style={styles.sectionText}>
            Device information, such as your mobile device's identifier number, model, and
            manufacturer, the operating system version on your device, your phone number, nation,
            and location, and any other data you wish to share.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.sectionText}>
            We may ask for your permission to send you push alerts about your account or the
            Application. If you choose to opt-out of receiving these types of communications, you
            can disable them in the settings of your device.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Third-Party Data</Text>
          <Text style={styles.sectionText}>
            Third-party data, such as personal information or network friends, may be accessed by
            the Application if you connect your account to the third party and provide the
            Application permission to access this data.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>
            Information Collected Through Contests, Giveaways, and Surveys
          </Text>
          <Text style={styles.sectionText}>
            You may furnish us with personal and other information when entering contests or
            giveaways and/or responding to surveys.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>USE OF YOUR INFORMATION</Text>
        <Text style={styles.sectionText}>
          Accurate information about you enables us to deliver a seamless, efficient, and
          personalised experience to you. We may use information about you gathered through the
          Application to:
          <br />• Administer sweepstakes, promotions, and contests.
          <br />• Assist law enforcement with investigations and react to subpoenas.
          <br />• Compile and analyze anonymous statistical data for internal use or sharing with
          third parties.
          <br />• Create an account for you and manage it.
          <br />• Provide you with personalized advertising, coupons, newsletters, and other
          information about promotions and the Application.
          <br />• You will receive an email regarding your account or order.
          <br />• Allow for inter-user communication.
          <br />• Fulfill and manage application-related purchases, orders, payments, and other
          transactions.
          <br />• Create a personal profile for you in order to enhance the personalization of
          future visits to the Application.
          <br />• Enhance the application's efficiency and functionality.
          <br />• Analyze and monitor usage and trends in order to enhance your experience with the
          Application.
          <br />• Notify you of application updates.
          <br />• We will contact you with new products, services, mobile applications, and/or
          recommendations.
          <br />• Conduct additional business activity as required.
          <br />• Avoid fraudulent purchases, keep an eye out for theft, and safeguard against
          criminal activities.
          <br />• Payments and refunds are processed.
          <br />• We will solicit feedback and communicate with you regarding your use of the
          Application.
          <br />• Resolve conflicts and troubleshoot issues.
          <br />• Respond to inquiries about products and customer service.
          <br />• Send you a newsletter.
          <br />• Solicit support with the application.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISCLOSURE OF YOUR INFORMATION</Text>
        <Text style={styles.sectionText}>
          In certain circumstances, we may share information we have acquired about you. Your
          information may be shared in the following ways:
        </Text>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>By Law or for the Purpose of Protecting Rights</Text>
          <Text style={styles.sectionText}>
            If we believe that disclosing information about you is necessary to comply with legal
            process, to investigate or rectify potential policy breaches, or to protect the rights,
            property, or safety of others, we may do so in accordance with applicable law, rule, or
            regulation. This involves exchanging information with other entities for the purpose of
            preventing fraud and mitigating credit risk.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Providers of Third-Party Services</Text>
          <Text style={styles.sectionText}>
            We may share your information with third-party service providers who execute functions
            on or on our behalf, such as payment processing, data analysis, email delivery, hosting
            services, customer care, and marketing help.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Communications Marketing</Text>
          <Text style={styles.sectionText}>
            We may share your information with third parties for marketing purposes with your
            consent or with a chance for you to withdraw consent, as permitted by law.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>User-to-User Interactions</Text>
          <Text style={styles.sectionText}>
            If you interact with other Application users, they may see your name, profile photo, and
            descriptions of your activities, which may include inviting other users, interacting
            with other users, like posts, and following blogs.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Online Advertisements</Text>
          <Text style={styles.sectionText}>
            When you submit comments, submissions, or other content to the Applications, they may be
            viewable by all users and may be publicly distributed in perpetuity outside the
            Application.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Advertisers from Third Parties</Text>
          <Text style={styles.sectionText}>
            When you visit the Application, we may employ the services of third-party advertising
            businesses to provide advertisements. These firms may use information about your visits
            to the Application and other websites contained in web cookies to serve you advertising
            for goods and services that may be of interest to you.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Affiliates</Text>
          <Text style={styles.sectionText}>
            In the event that we disclose your information with our affiliates, we will require them
            to adhere to this Privacy Policy. Affiliates include our parent firm and any
            subsidiaries, joint venture partners, or other businesses that we own or manage jointly.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Partners in Business</Text>
          <Text style={styles.sectionText}>
            We may share your information with business partners in order to provide you with
            certain products, services, or promotions.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Offer Wall</Text>
          <Text style={styles.sectionText}>
            The Application may display a "offer wall" hosted by a third party. Third-party
            marketers can utilize such an offer wall to offer consumers virtual currency, presents,
            or other stuff in exchange for accepting and completing an advertisement offer. This
            type of offer wall may emerge in the Application and be displayed to you based on
            particular facts, such as your geographic location or demographic data. When you click
            on an offer wall, the Application will exit. To avoid fraud and properly credit your
            account, a unique identifier, such as your user ID, will be communicated with the offer
            wall provider.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Contacts on Social Media</Text>
          <Text style={styles.sectionText}>
            If you connect to the Application via a social network, your social network connections
            will see your name, profile photo, and activity descriptions.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Additional Third Parties</Text>
          <Text style={styles.sectionText}>
            We may disclose your information to marketers and investors in order to undertake
            general business analysis. Additionally, as permitted by law, we may share your
            information with such third parties for marketing reasons.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Sale or Insolvency</Text>
          <Text style={styles.sectionText}>
            We may transmit your information to the successor business if we restructure or sell all
            or a portion of our assets, merge, or are acquired by another entity. If we are forced
            to close our doors or declare bankruptcy, your information will be transferred or
            acquired by a third party. You acknowledge that such transfers may occur and that the
            transferee may choose not to follow the Privacy Policy's commitments.
          </Text>
          <Text style={styles.sectionText}>
            We are not responsible for the acts of third parties with whom you submit personally
            identifiable or sensitive data, and we lack the capacity to oversee or supervise
            third-party solicitations. If you desire to unsubscribe from correspondence, emails, or
            other third-party communications, you must contact the third party directly.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TRACKING TECHNOLOGIES</Text>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Cookies and Web Beacons</Text>
          <Text style={styles.sectionText}>
            On the Application, we may use cookies, web beacons, tracking pixels, and other tracking
            technologies to help us tailor it and improve your experience. When you access the
            Application, no tracking technology is used to acquire your personal information. By
            default, the majority of browsers accept cookies. You may delete or reject cookies, but
            be aware that doing so may impair the Application's availability and functioning. You
            cannot opt out of web beacons. They can be disabled, however, by declining all cookies
            or by configuring your web browser's settings to inform you each time a cookie is
            offered, allowing you to accept or decline cookies on an individual basis.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Internet-Based Advertising</Text>
          <Text style={styles.sectionText}>
            Additionally, we may utilize third-party software to deliver advertisements on the
            Application, handle email marketing campaigns, and manage other forms of interactive
            marketing. This third-party software may employ cookies or similar tracking technologies
            in order to assist us in managing and optimizing your online experience with us. To
            learn more about how to opt out of interest-based advertising, visit the Network
            Advertising Initiative Opt-Out Tool or Digital Advertising Alliance Opt-Out Tool.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Website Analytics</Text>
          <Text style={styles.sectionText}>
            Additionally, we may partner with carefully selected third-party vendors to enable
            tracking technologies and remarketing services on the Application through the use of
            first-party cookies and third-party cookies, in order to analyze and track users' use of
            the Application, ascertain the popularity of particular content, and gain a better
            understanding of online activity. By using the Application, you consent to these
            third-party providers collecting and using your information. You are invited to read
            their privacy statement and to contact them directly with any issues. We do not provide
            these third-party suppliers with any personal information. You should be aware that
            purchasing a new computer, installing a new browser, upgrading an old browser, or
            deleting or otherwise altering the cookies files in your browser may also delete certain
            opt-out cookies, plug-ins, or preferences.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>THIRD-PARTY WEBSITES</Text>
        <Text style={styles.sectionText}>
          The Application may contain links to third-party websites and applications, as well as
          advertisements and third-party services, with which we are not involved. Once you leave
          the Application through these links, any information you supply to these third parties is
          not covered by this Privacy Policy, and we cannot ensure the security or privacy of your
          information. Before visiting and providing information to any third-party websites, you
          should familiarize yourself with the third party's privacy policies and practices (if
          applicable), and take whatever precautions are necessary to ensure the privacy of your
          information. We are not responsible for the content, privacy and security practices and
          policies of third parties, including third-party websites, services, or apps that may be
          linked to or from the Application.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY OF YOUR INFORMATION</Text>
        <Text style={styles.sectionText}>
          We protect your personal information by administrative, technical, and physical security
          methods. While we have taken reasonable steps to safeguard the personal information you
          supply to us, please be aware that no security mechanism is perfect or impregnable, and no
          mode of data transmission can be guaranteed to be free of interception or other type of
          misuse. Any information given online is at risk of being intercepted and misused by
          uninvited parties. As a result, we cannot guarantee the complete confidentiality of your
          personal information if you supply it.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>POLICY FOR CHILDREN</Text>
        <Text style={styles.sectionText}>
          We do not intentionally collect or market to children under the age of 13. If you become
          aware that we have collected information from children under the age of 13, please contact
          us using the details provided below.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
        <Text style={styles.sectionText}>
          Most web browsers and some mobile operating systems as well as our mobile application
          contain a Do-Not-Track ("DNT") function or setting that you can enable to indicate your
          privacy preference regarding the monitoring and collection of data about your online
          browsing activity. There is no defined technical standard for identifying and executing
          DNT signals. As such, we presently do not respond to Do Not Track browser signals or any
          other system that automatically expresses your preference not to be tracked online. If a
          standard for online monitoring is adopted in the future that we must comply, we will
          notify you in a revised version of this Privacy Policy.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OPTIONS REGARDING YOUR INFORMATION</Text>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Text style={styles.sectionText}>
            You may examine or edit the information in your account at any time, or you may
            terminate your account by:
            <br />• Accessing and changing your account settings.
            <br />• Using the contact information provided below, you can contact us. We shall
            deactivate or remove your account and associated information from our active databases
            upon your request to cancel your account. However, we may store certain information in
            our files to prevent fraud, troubleshoot problems, assist with investigations, enforce
            our{' '}
            <Text role="link" href={'/terms'} style={{textDecorationLine: 'underline'}}>
              Terms of Use
            </Text>
            , and/or comply with legal laws.
          </Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.sectionTitle}>Emails and Communications</Text>
          <Text style={styles.sectionText}>
            If you choose to unsubscribe from contact, emails, or other communications from us, you
            may do so as follows:
            <br />• Taking note of your choices when you create an account with the Application.
            <br />• Accessing your account settings and making changes to your preferences.
            <br />• Using the contact information provided below, you can contact us. If you desire
            to unsubscribe from correspondence, emails, or other third-party communications, you
            must contact the third party directly.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTACT US</Text>
        <Text style={styles.sectionText}>
          If you have questions or comments about this Privacy Policy, please contact us at{' '}
          <Text style={styles.sectionText}>
            In order to resolve a complaint regarding the App or to receive further information
            regarding use of the App, please contact us at{' '}
            <Text
              role="link"
              href={'mailto:lyrist.app@gmail.com'}
              style={[styles.text, {textDecorationLine: 'underline'}]}>
              lyrist.app@gmail.com
            </Text>
            .
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 24,
  },
  pageTitle: {
    alignItems: 'center',
    fontFamily: 'Fira Sans',
    fontSize: 24,
  },
  subSection: {paddingLeft: 12, paddingTop: 12},
  section: {
    paddingTop: 24,
  },
  sectionText: {
    fontFamily: 'Fira Sans',
  },
  sectionTitle: {
    fontFamily: 'Fira Sans',
    fontWeight: 600,
  },
});
