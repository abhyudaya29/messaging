// /email/VerificationEmail.tsx
import {
  Html,
  Head,
  Section,
  Row,
  Heading,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
      </Head>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>Thank you for registering. Please use the following verification code:</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Row>
      </Section>
    </Html>
  );
};

export default VerificationEmail;
