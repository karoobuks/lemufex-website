import {
  Html, Head, Preview, Body, Container,
  Heading, Text, Button, Section, Hr,
} from "@react-email/components";

export default function WelcomeEmail({ userName, unsubscribeUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Lemufex Engineering Newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Lemufex Engineering</Heading>
            <Text style={headerSub}>Newsletter Subscription Confirmed</Text>
          </Section>

          {/* Body */}
          <Section style={body}>
            <Heading style={greeting}>Welcome, {userName || "Friend"}! 🎉</Heading>

            <Text style={paragraph}>
              Thank you for subscribing to the <strong>Lemufex Engineering</strong> newsletter.
              You are now part of a growing community of engineering professionals and enthusiasts.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightTitle}>What to expect from us:</Text>
              <Text style={highlightItem}>✅ Engineering insights &amp; industry news</Text>
              <Text style={highlightItem}>✅ Upcoming training programs &amp; workshops</Text>
              <Text style={highlightItem}>✅ Exclusive service offers &amp; announcements</Text>
              <Text style={highlightItem}>✅ Project showcases &amp; case studies</Text>
            </Section>

            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              <Button style={ctaButton} href={process.env.NEXT_PUBLIC_DOMAIN || "https://lemufex.com"}>
                Visit Our Website
              </Button>
            </Section>

            <Text style={paragraph}>
              We are excited to have you on board. Stay tuned for our next update!
            </Text>

            <Text style={signature}>
              Best regards,<br />
              <strong style={{ color: "#081C3C" }}>Lemufex Engineering Team</strong>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Lemufex Engineering. All rights reserved.
            </Text>
            {unsubscribeUrl && (
              <Text style={footerText}>
                Don&apos;t want to receive these emails?{" "}
                <a href={unsubscribeUrl} style={{ color: "#FE9900" }}>Unsubscribe</a>
              </Text>
            )}
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#F3F4F6", fontFamily: "Arial, sans-serif" };

const container = {
  maxWidth: "600px", margin: "20px auto",
  border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden",
};

const header = {
  backgroundColor: "#081C3C", padding: "32px 24px", textAlign: "center",
};

const headerTitle = {
  color: "#FE9900", margin: "0", fontSize: "24px", fontWeight: "bold",
};

const headerSub = {
  color: "#ffffff", margin: "8px 0 0", fontSize: "14px",
};

const body = { backgroundColor: "#ffffff", padding: "32px 24px" };

const greeting = {
  color: "#081C3C", fontSize: "22px", fontWeight: "bold", marginBottom: "16px",
};

const paragraph = {
  color: "#374151", fontSize: "15px", lineHeight: "1.6", margin: "16px 0",
};

const highlightBox = {
  backgroundColor: "#FFF7ED", borderLeft: "4px solid #FE9900",
  padding: "16px 20px", borderRadius: "4px", margin: "24px 0",
};

const highlightTitle = {
  color: "#92400E", fontWeight: "bold", fontSize: "13px",
  textTransform: "uppercase", margin: "0 0 10px",
};

const highlightItem = {
  color: "#374151", fontSize: "14px", margin: "6px 0",
};

const ctaButton = {
  backgroundColor: "#FE9900", color: "#ffffff",
  padding: "14px 32px", borderRadius: "8px",
  fontWeight: "bold", fontSize: "15px", textDecoration: "none",
  display: "inline-block",
};

const signature = {
  color: "#374151", fontSize: "15px", marginTop: "24px", lineHeight: "1.6",
};

const divider = { borderColor: "#e5e7eb", margin: "0" };

const footer = {
  backgroundColor: "#F3F4F6", padding: "16px 24px", textAlign: "center",
};

const footerText = {
  color: "#9CA3AF", fontSize: "12px", margin: "4px 0",
};
