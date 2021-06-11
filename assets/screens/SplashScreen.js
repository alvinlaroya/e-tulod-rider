import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  Text,
  Animated,
  ScrollView,
} from "react-native";
import { ImageBackground, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, TextInput } from "react-native-paper";

import { fb } from "../../firebase";

const db = fb.firestore();
const logo = require("../img/etulodlogowhite.png");

function SplashScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    NavigationAuthToHome();
  }, [hasSession]);

  const NavigationAuthToHome = () => {
    var loggedIn = false;
    fb.auth().onAuthStateChanged((user) => {
      if (user != null) {
        setHasSession(true);
        console.log("We Are Authenticated!!!!");
        var docRef = db.collection("drivers").doc(user.uid);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              if (doc.data().accepted === true) {
                if(loggedIn === false) {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                            name: "MainScreen",
                            params: {
                                userId: user.uid,
                                fname: doc.data().fname,
                                lname: doc.data().lname,
                                email: doc.data().email,
                                contact: doc.data().contact,
                                address: doc.data().address,
                                profile: doc.data().profile,
                            },
                            },
                        ],
                    });
                }
                loggedIn = true
              } else {
                if(loggedIn === false) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "NotAcceptedScreen" }],
                  });
                }
                loggedIn = true
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      } else {
        setHasSession(false);
      }
    });
  };

  return !hasSession ? (
    <View style={styles.centeredView}>
      <StatusBar style="auto" />
      <View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
            color: "#05686e",
          }}
        >
          e-tulod Terms and Conditions
        </Text>
      </View>
      <ScrollView style={{ padding: 20, width: "100%" }}>
        <View style={{ width: "100%", alignItems: "center", alignContent: 'center' }}>
          <Text style={{ alignItems: "center", alignSelf: 'center' }}>
            Welcome to e-TULOD! These terms and conditions outline the rules and
            regulations for the use of electronic-Tricycle Unloading-Loading On
            Destination's (e-TULOD) Website, located at e-TULOD By accessing
            this website we assume you accept these terms and conditions. Do not
            continue to use e-TULOD if you do not agree to take all the terms
            and conditions stated on this page. The following terminology
            applies to these Terms and Conditions, Privacy Statement and
            Disclaimer Notice and all Agreements: "Client", "You" and "Your"
            refers to you, the person log in on this website and compliant to
            the Company’s terms and conditions. "The Company", "Ourselves",
            "We", "Our" and "Us", refers to our Company. "Party", "Parties", or
            "Us", refers to both the Client and ourselves. All terms refer to
            the offer, acceptance and consideration of payment necessary to
            undertake the process of our assistance to the Client in the most
            appropriate manner for the express purpose of meeting the Client’s
            needs in respect of provision of the Company’s stated services, in
            accordance with and subject to, prevailing law of Netherlands. Any
            use of the above terminology or other words in the singular, plural,
            capitalization and/or he/she or they are taken as interchangeable
            and therefore as referring to the same. Cookies We employ the use of
            cookies. By accessing e-TULOD, you agreed to use cookies in
            agreement with the electronic-Tricycle Unloading-Loading on
            destination's Privacy Policy. Most interactive websites use cookies
            to let us retrieve the user’s details for each visit. Cookies are
            used by our website to enable the functionality of certain areas to
            make it easier for people visiting our website. Some of our
            affiliate/advertising partners may also use cookies. License Unless
            otherwise stated, electric-Tricycle Unloading-Loading On Destination
            (e-TULOD) and/or its licensors own the intellectual property rights
            for all material on e-TULOD. All intellectual property rights are
            reserved. You may access this from e-TULOD for your own personal use
            subject to restrictions set in these terms and conditions. You must
            not: ● Republish material from e-TULOD ● Sell, rent or sub-license
            material from e-TULOD ● Reproduce, duplicate or copy material from
            e-TULOD ● Redistribute content from e-TULOD This Agreement shall
            begin on the date. We created our Terms and Conditions with the help
            of the Terms And Conditions Generator. Parts of this website offer
            an opportunity for users to post and exchange opinions and
            information in certain areas of the website. electric-Tricycle
            Unloading-Loading On Destination (e-TULOD) does not filter, edit,
            publish or review Comments prior to their presence on the website.
            Comments do not reflect the views and opinions of electric-Tricycle
            Unloading-Loading On Destination (e-TULOD),its agents and/or
            affiliates. Comments reflect the views and opinions of the person
            who posts their views and opinions. To the extent permitted by
            applicable laws, electric-Tricycle Unloading-Loading On Destination
            (e-TULOD) shall not be liable for the Comments or for any liability,
            damages or expenses caused and/or suffered as a result of any use of
            and/or posting off and/or appearance of the Comments on this
            website. electric-Tricycle Unloading-Loading On Destination
            (e-TULOD) reserves the right to monitor all Comments and to remove
            any Comments which can be considered inappropriate, offensive or
            cause a breach of these Terms and Conditions. You warrant and
            represent that: ● You are entitled to post the Comments on our
            website and have all necessary licenses and consents to do so; ● The
            Comments do not invade any intellectual property rights, including
            without limitation copyright, patent or trademark of any third
            party; ● The Comments do not contain any defamatory, libelous,
            offensive, indecent or otherwise unlawful material which is an
            invasion of privacy ● The Comments will not be used to solicit or
            promote business or custom or present commercial activities or
            unlawful activity. You grant electric-Tricycle Unloading-Loading On
            Destination (e-TULOD) a non-exclusive license to use, reproduce,
            edit and allow others to use, reproduce and edit any of your
            Comments in all forms, formats or media. Hyperlinking to our Content
            The following organizations may link to our Website without prior
            written approval: ● Government agencies; ● Search engines; ● News
            organizations; ● Online directory distributors may link to our
            Website as they hyperlink to the Websites of other listed
            businesses; and ● System-wide Accredited Businesses except
            soliciting non-profit organizations, charity shopping malls, and
            charity fundraising groups which may not hyperlink to our Website.
            These organizations may link to our home page, to publications or to
            other Website information so long as the link: (a) is not in any way
            deceptive; (b) does not falsely imply sponsorship, endorsement or
            approval of the linking party and its products and/or services; and
            (c) fits within the context of the linking party’s site. We may
            consider and approve other link requests from the following
            organizations: ● commonly known consumer and/or business information
            sources; ● dot.com community sites; ● associations or other groups
            representing charities; ● online directory distributors; ● internet
            portals; ● Accounting, law and consulting firms; and ● educational
            institutions and trade associations. We will approve link requests
            from these organizations if we decide that: (a) the link would not
            make us look unfavorably to ourselves or to our accredited
            businesses; (b) the organization does not have any negative records
            with us; (c) the benefit to us from the visibility of the hyperlink
            compensates the absence of electric-Tricycle Unloading-Loading On
            Destination (e-TULOD); and (d) the link is resource information.
            These organizations may link to our home page so long as the link:
            (a) is not in any way deceptive; (b) does not falsely imply
            sponsorship, endorsement or approval of the linking party and its
            products or services; and (c) fits within the context of the linking
            party’s site. If you are one organization listed in paragraph 2
            above and are interested in linking to our website, you must inform
            us by emailing electric-Tricycle Unloading-Loading On Destination
            (e-TULOD). Please include your name, your organization name, contact
            information and the URL of your site, a list of any URLs from which
            you intend to link to our Website, and a list of the URLs on our
            site to which you would like to link. Wait 2-3 weeks for a response.
            Approved organizations may hyperlink to our Website: ● By use of our
            corporate name; or ● By use of the uniform resource locator being
            linked to; or ● By use of any other description of our Website being
            linked to that makes sense within the context and format of content
            on the linking party’s site. No use of electronic-Tricycle
            Unloading-Loading On Destination's logo or other artwork will allow
            for linking absent a trademark license agreement. iFrames Without
            prior approval and written permission, you may not create frames
            around our Web Pages that alter in any way the visual presentation
            or appearance of our Website. Content Liability I shall not hold us
            responsible for any content that appears on your Website. You agree
            to protect and defend us against all claims that are rising on your
            Website. No link(s) should appear on any Website that may be
            interpreted as libelous, obscene or criminal, or which infringes,
            otherwise violates, or advocates the infringement or other violation
            of any third party rights. Your Privacy Please read Privacy Policy
            Reservation of Rights We reserve the right to request that you
            remove all links or any link to our Website. You approve to remove
            immediately all links to our Website upon request. We also reserve
            the right to amend these terms and conditions and it’s linking
            policy. By continuously linking to our Website, you agree to be
            bound to and follow these linking terms and conditions. Removal of
            links from our website If you find any link on our website that is
            offensive for any reason, you are free to contact and inform us any
            moment. We will consider requests to remove links but we are not
            obligated to or so or to respond to you directly. We do not ensure
            that the information on this website is correct; we do not warrant
            its completeness or accuracy; nor do we promise to ensure that the
            website remains available or that the material on the website is up
            to date. Disclaimer To the maximum extent permitted by applicable
            law, we exclude all representations, warranties and conditions
            relating to our website and the use of this website. Nothing in this
            disclaimer will: ● limit or exclude our or your liability for death
            or personal injury; ● limit or exclude our or your liability for
            fraud or fraudulent misrepresentation; ● limit any of our or your
            liabilities in any way that is not permitted under applicable law;
            or ● exclude any of our or your liabilities that may not be excluded
            under applicable law. The limitations and prohibitions of liability
            set in this Section and elsewhere in this disclaimer: (a) are
            subject to the preceding paragraph; and (b) govern all liabilities
            arising under the disclaimer, including liabilities arising in
            contract, in tort and for breach of statutory duty. As long as the
            website and the information and services on the website are free, we
            will not be liable for any loss or damage of any nature. Privacy
            Policy for e-Tulod
            https://www.privacypolicygenerator.info/download.php?lang=en&token=ex0G1GPut0LEwHBI6n
            1584LL5igOHUUQ At e-Tulod, accessible from e-Tulod, one of our major
            priorities is the privacy of our visitors. This Privacy Policy
            document contains types of information that is collected and
            recorded by e-Tulod and how we use it. If you have additional
            questions or require more information about our Privacy Policy,
            contact us. This Privacy Policy applies only to our online
            activities and is valid for visitors to our website regarding the
            information that they shared and/or collected in e-Tulod. This
            policy is not applicable to any information collected offline or via
            channels other than this website. We created our Privacy Policy with
            the help of the Privacy Policy Generator. Consent By using our
            website, you consent to our Privacy Policy and agree to its terms.
            Information we collect The personal information that you are asked
            to provide, and the reasons why you are asked to provide it, will be
            made clear to you at the point we ask you to provide your personal
            information. If you contact us directly, we may receive additional
            information about you such as your name, email address, phone
            number, the contents of the message and/or attachments you may send
            us, and any other information you may choose to provide. When you
            register for an Account, we may ask for your contact information,
            including items such as name, company name, address, email address,
            and telephone number. How we use your information We use the
            information we collect in various ways, including to: ● Provide,
            operate, and maintain our website ● Improve, personalize, and expand
            our website ● Understand and analyze how you use our website ●
            Develop new products, services, features, and functionality ●
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes ● Send you emails ● Find and
            prevent fraud Log Files e-Tulod follows a standard procedure for
            using log files. These files log visitors when they visit websites.
            All hosting companies do this as part of hosting services'
            analytics. The information collected by log files includes internet
            protocol (IP) addresses, browser type, Internet Service Provider
            (ISP), date and time stamp, referring/exit pages, and possibly the
            number of clicks. These are not linked to any information that is
            personally identifiable. The purpose of the information is for
            analyzing trends, administering the site, tracking users' movement
            on the website, and gathering demographic information. Cookies and
            Web Beacons Like any other website, e-Tulod uses 'cookies'. These
            cookies are used to store information including visitors'
            preferences, and the pages on the website that the visitor accessed
            or visited. The information is used to optimize the users'
            experience by customizing our web page content based on visitors'
            browser type and/or other information. For more general information
            on cookies, please read "What Are Cookies". Our Advertising Partners
            Some of the advertisers on our site may use cookies and web beacons.
            Our advertising partners are listed below. Each of our advertising
            partners has their own Privacy Policy for their policies on user
            data. For easier access, we hyperlinked to their Privacy Policies
            below. ● Google https://policies.google.com/technologies/ads
            Advertising Partners Privacy Policies You may consult this list to
            find the Privacy Policy for each of the advertising partners of
            e-Tulod. Third-party ad servers or ad networks use technologies like
            cookies, JavaScript, or Web Beacons that are used in their
            respective advertisements and links that appear in e-Tulod, which
            are sent directly to users' browsers. They automatically receive
            your IP address when this occurs. These technologies are used to
            measure the effectiveness of their advertising campaigns and/or to
            personalize the advertising content that you see on websites that
            you visit. Note that e-Tulod has no access to or control over these
            cookies that are used by third-party advertisers. Third Party
            Privacy Policies e-Tulod's Privacy Policy does not apply to other
            advertisers or websites. Thus, we are advising you to consult the
            respective Privacy Policies of these third-party ad servers for more
            detailed information. It may include their practices and
            instructions about how to opt-out of certain options. You can choose
            to disable cookies through your individual browser options. To know
            more detailed information about cookie management with specific web
            browsers, we can find it at the browsers' respective websites. CCPA
            Privacy Rights (Do Not Sell My Personal Information) Under the CCPA,
            among other rights, California consumers have the right to: Request
            that a business that collects a consumer's personal data discloses
            the categories and specific pieces of personal data that a business
            has collected about consumers. Request that a business delete any
            personal data about the consumer that a business has collected.
            Request that a business that sells a consumer's personal data, not
            sell the consumer's personal data. If you make a request, we have
            one month to respond to you. If you would like to exercise any of
            these rights, please contact us. GDPR Data Protection Rights We
            would like to make sure you are fully aware of all of your data
            protection rights. Every user is entitled to the following: The
            right to access – You may request copies of your personal data. We
            may charge you a small fee for this service. The right to
            rectification – You may request that we correct any information you
            believe is inaccurate. You also may request that we complete the
            information you believe is incomplete. The right to erasure – You
            may request that we erase your personal data, under certain
            conditions. The right to restrict processing – You may request that
            we restrict the processing of your personal data, under certain
            conditions. The right to object to processing – You may object to
            our processing of your personal data, under certain conditions. The
            right to data portability – You may request that we transfer the
            data that we have collected to another organization, or directly to
            you, under certain conditions. If you make a request, we have one
            month to respond to you. If you would like to exercise any of these
            rights, please contact us. Children's Information Another part of
            our priority is adding protection for children while using the
            internet. We encourage parents and guardians to observe, participate
            in, and/or monitor and guide their online activity. e-Tulod does not
            knowingly collect any Personal Identifiable Information from
            children under the age of 13. If you think that your child provided
            this kind of information on our website, we strongly encourage you
            to contact us immediately and we will do our best efforts to
            promptly remove such information from our records.
          </Text>
        </View>
        <View style={{ width: "100%", marginTop: 10, marginBottom: 90 }}>
          <Button
            icon="shield-account"
            mode="outlined"
            contentStyle={{ height: 50 }}
            color="#05686e"
            style={{ width: "100%", justifyContent: "center" }}
            labelStyle={{ fontSize: 17 }}
            onPress={() => {
              navigation.navigate("SignupScreen");
            }}
          >
            Continue and Sign me up
          </Button>
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          height: 20,
          position: "absolute",
          bottom: 10,
          lef: 0,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "gray",
              textAlign: "center",
            }}
          >
            e-tulod terms and conditions
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Image source={logo} style={{ height: 90, width: 90 }}></Image>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 8,
          color: "white",
        }}
      >
        e-tulod Rider
      </Text>
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1991a1",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
