import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from "@react-email/components";

export default function WelcomeEmail({ userName }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Lemufex Newsletter 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome, {userName || "Friend"}! 🎉</Heading>
          <Text style={paragraph}>
            Thanks for subscribing to <strong>Lemufex Engineering Group</strong>’s
            newsletter. You’ll now receive updates on:
          </Text>

          <ul style={{ marginLeft: "20px", color: "#555" }}>
            <li>Engineering insights & training</li>
            <li>Upcoming workshops & events</li>
            <li>Exclusive service offers</li>
          </ul>

          <Section style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              paddingx={20}
              paddingy={12}
              style={button}
              href="https://lemufex.com"
            >
              Visit Our Website
            </Button>
          </Section>

          <Text style={footer}>
            © {new Date().getFullYear()} Lemufex Engineering Group. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f4",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px",
  margin: "20px auto",
  maxWidth: "600px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const heading = {
  color: "#1E2A38",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#1E2A38",
  color: "#fff",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
};

const footer = {
  color: "#888",
  fontSize: "12px",
  marginTop: "40px",
  textAlign: "center",
};
