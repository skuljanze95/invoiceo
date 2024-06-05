import * as React from "react";

import { Body, Container, Head, Html, Preview } from "@react-email/components";

// Invoice email template
export function SendInvoiceWithPdf() {
  return (
    <Html>
      <Head />
      <Preview>Invoice</Preview>
      <Body style={main}>
        <Container style={container}>Invoice</Container>
      </Body>
    </Html>
  );
}

export default SendInvoiceWithPdf;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "20px 0 48px",
};
