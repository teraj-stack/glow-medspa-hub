import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface WelcomeEmailProps {
  name?: string
  siteUrl?: string
  loginUrl?: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
}

const container = {
  padding: '40px 32px',
  maxWidth: '560px',
  margin: '0 auto',
}

const heading = {
  fontSize: '26px',
  fontWeight: 600,
  color: '#0a0a0a',
  margin: '0 0 24px',
  fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
}

const accentLine = {
  width: '48px',
  height: '2px',
  backgroundColor: '#bda38f',
  margin: '0 0 28px',
}

const text = {
  fontSize: '15px',
  color: '#555555',
  lineHeight: '1.65',
  margin: '0 0 20px',
}

const greeting = {
  fontSize: '15px',
  color: '#555555',
  lineHeight: '1.65',
  margin: '0 0 8px',
}

const buttonStyle = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '6px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 28px',
}

const linkStyle = {
  color: '#bda38f',
  textDecoration: 'underline',
}

const footer = {
  fontSize: '12px',
  color: '#999999',
  lineHeight: '1.5',
  margin: '24px 0 0',
}

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #e5e5e5',
  margin: '32px 0 24px',
}

const smallHeading = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#0a0a0a',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
}

const listItem = {
  fontSize: '14px',
  color: '#555555',
  lineHeight: '1.65',
  margin: '0 0 8px',
}

const siteNameStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#bda38f',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}

export const WelcomeEmail = ({
  name,
  siteUrl = 'https://bmclinics.ai',
  loginUrl = 'https://bmclinics.ai/auth',
}: WelcomeEmailProps) => (
  <Html lang="pl" dir="ltr">
    <Head />
    <Preview>Witamy w Beauty & Mind Clinic — Twoja podróż z pięknem zaczyna się teraz</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Text style={siteNameStyle}>Beauty & Mind Clinic</Text>
          <div style={accentLine} />
          <Heading style={heading}>Witamy w klinice</Heading>
          {name ? (
            <Text style={greeting}>Dzień dobry {name},</Text>
          ) : (
            <Text style={greeting}>Dzień dobry,</Text>
          )}
          <Text style={text}>
            Dziękujemy za dołączenie do <strong>Beauty & Mind Clinic</strong>. Twoje konto
            zostało pomyślnie utworzone i jesteśmy gotowi, by towarzyszyć Ci w podróży
            ku naturalnemu pięknu.
          </Text>
          <Text style={text}>
            W naszej klinice wierzymy, że prawdziwe piękno wynika z harmonii ciała i umysłu.
            Każdy protokół — od konsultacji po zabieg — tworzymy z myślą o Tobie, Twojej skórze
            i Twoich potrzebach.
          </Text>
        </Section>

        <Hr style={hrStyle} />

        <Section>
          <Text style={smallHeading}>Co możesz teraz zrobić</Text>
          <Text style={listItem}>• Zalogować się do panelu pacjenta i przeglądać historię wizyt</Text>
          <Text style={listItem}>• Umówić konsultację online z naszymi specjalistami</Text>
          <Text style={listItem}>• Poznać dostępne rozwiązania i technologie</Text>
          <Text style={listItem}>• Otrzymywać spersonalizowane rekomendacje pielęgnacyjne</Text>
        </Section>

        <Section>
          <Button href={loginUrl} style={buttonStyle}>
            Przejdź do panelu
          </Button>
        </Section>

        <Hr style={hrStyle} />

        <Section>
          <Text style={text}>
            Masz pytania? Napisz do nas na{' '}
            <Link href="mailto:kontakt@bmclinics.ai" style={linkStyle}>
              kontakt@bmclinics.ai
            </Link>{' '}
            lub zadzwoń pod numer{' '}
            <Link href="tel:+48257007144" style={linkStyle}>
              +48 257 007 144
            </Link>
            .
          </Text>
          <Text style={text}>
            Z wyrazami szacunku,
            <br />
            <strong>Zespół Beauty & Mind Clinic</strong>
          </Text>
        </Section>

        <Text style={footer}>
          Beauty & Mind Clinic · Siedlce
          <br />
          <Link href={siteUrl} style={{ ...linkStyle, fontSize: '12px' }}>
            bmclinics.ai
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Witamy w Beauty & Mind Clinic',
  displayName: 'Wiadomość powitalna',
  previewData: { name: 'Anna' },
} satisfies TemplateEntry
