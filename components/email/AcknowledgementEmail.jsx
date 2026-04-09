import {
  Html, Head, Preview, Body, Container,
  Heading, Text, Section, Hr,
} from "@react-email/components";

export default function AcknowledgementEmail({ name }) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your message – Lemufex Engineering</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Lemufex Engineering</Heading>
            <Text style={headerSub}>Message Received</Text>
          </Section>

          {/* Body */}
          <Section style={body}>
            <Text style={paragraph}>
              Dear <strong>{name || "Valued Client"}</strong>,
            </Text>
            <Text style={paragraph}>
              Thank you for reaching out to <strong>Lemufex Engineering</strong>.
              We have received your message and our team will get back to you as soon as possible.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                We typically respond within <strong>24–48 hours</strong>.
                If your inquiry is urgent, please reply directly to this email.
              </Text>
            </Section>

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
            <Text style={footerText}>
              This is an automated acknowledgement. Please do not reply directly to this email.
            </Text>
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

const paragraph = {
  color: "#374151", fontSize: "15px", lineHeight: "1.6", margin: "12px 0",
};

const highlightBox = {
  backgroundColor: "#FFF7ED", borderLeft: "4px solid #FE9900",
  padding: "16px", borderRadius: "4px", margin: "24px 0",
};

const highlightText = {
  color: "#92400E", fontSize: "14px", margin: "0",
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
