import * as React from "react";

export default function UnsubscribeEmail({ userName, unsubscribeLink }) {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "20px 30px", textAlign: "center" }}>
              <img
                src="https://yourdomain.com/logo.png"
                alt="Lemufex Logo"
                width="60"
                height="60"
                style={{ borderRadius: "8px" }}
              />
              <h1
                style={{
                  fontSize: "22px",
                  color: "#081C3C",
                  marginTop: "15px",
                  marginBottom: "0",
                }}
              >
                Stay Connected with Lemufex 💌
              </h1>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "0 30px 20px 30px" }}>
              <p style={{ fontSize: "16px", color: "#444", margin: "20px 0" }}>
                Hi <strong>{userName}</strong>,
              </p>

              <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.6" }}>
                We noticed you’re thinking of unsubscribing from our newsletter.
                We’ll be sad to see you go 😢.
                <br />
                If you really wish to unsubscribe, just click the button below.
              </p>

              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <a
                  href={unsubscribeLink}
                  style={{
                    display: "inline-block",
                    padding: "12px 25px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Unsubscribe Now
                </a>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "25px",
                  textAlign: "center",
                }}
              >
                If you didn’t request this, you can safely ignore this email and
                stay subscribed to Lemufex.
              </p>
            </td>
          </tr>

          <tr>
            <td
              style={{
                backgroundColor: "#081C3C",
                color: "#ffffff",
                textAlign: "center",
                padding: "15px 0",
                fontSize: "13px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              © {new Date().getFullYear()} Lemufex. All rights reserved.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
