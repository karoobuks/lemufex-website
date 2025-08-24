// emails/AcknowledgmentEmail.jsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

export default function AcknowledgmentEmail({ name }) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting Lemufex Group</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", padding: "20px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" }}>
          <Heading style={{ color: "#333" }}>Hi {name || "there"},</Heading>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            Thank you for reaching out to <b>Lemufex Group</b>.  
            We’ve received your message and our team will get back to you shortly.
          </Text>
          <Section style={{ marginTop: "20px" }}>
            <Text style={{ fontSize: "14px", color: "#888" }}>
              📩 This is an automated acknowledgment. Please do not reply directly.
            </Text>
          </Section>
          <Text style={{ marginTop: "30px", fontSize: "14px", color: "#555" }}>
            Best regards,  
            <br />
            <b>Lemufex Group Team</b>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
