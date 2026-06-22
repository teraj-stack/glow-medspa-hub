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

interface ConsultationIntakeEmailProps {
  name?: string
  consultationType?: 'online' | 'clinic' | string
  intakeFormUrl?: string
  appointmentDate?: string
  siteUrl?: string
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

const infoBox = {
  backgroundColor: '#faf7f3',
  borderLeft: '3px solid #bda38f',
  padding: '16px 20px',
  margin: '0 0 24px',
}

const infoLabel = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#999999',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}

const infoValue = {
  fontSize: '15px',
  color: '#0a0a0a',
  margin: '0',
  lineHeight: 1.5,
}

const consultationLabel = (type?: string) => {
  if (type === 'online') return 'Konsultacja online'
  if (type === 'clinic') return 'Konsultacja w klinice'
  return 'Konsultacja'
}

export const ConsultationIntakeEmail = ({
  name,
  consultationType,
  intakeFormUrl = 'https://bmclinics.ai/formularz-diagnostyczny',
  appointmentDate,
  siteUrl = 'https://bmclinics.ai',
}: ConsultationIntakeEmailProps) => (
  <Html lang="pl" dir="ltr">
    <Head />
    <Preview>Wypełnij formularz wstępnej diagnostyki przed konsultacją</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Text style={siteNameStyle}>Beauty & Mind Clinic</Text>
          <div style={accentLine} />
          <Heading style={heading}>Dziękujemy za zakup konsultacji</Heading>
          {name ? (
            <Text style={greeting}>Dzień dobry {name},</Text>
          ) : (
            <Text style={greeting}>Dzień dobry,</Text>
          )}
          <Text style={text}>
            Potwierdzamy zakup wybranej konsultacji. Aby nasi specjaliści mogli
            przygotować się do spotkania i zaproponować rozwiązania najlepiej
            dopasowane do Twoich potrzeb, prosimy o wypełnienie krótkiego
            formularza wstępnej diagnostyki.
          </Text>
        </Section>

        <Section style={infoBox}>
          <Text style={infoLabel}>Rodzaj wizyty</Text>
          <Text style={infoValue}>{consultationLabel(consultationType)}</Text>
          {appointmentDate ? (
            <>
              <Text style={{ ...infoLabel, marginTop: '12px' }}>Termin</Text>
              <Text style={infoValue}>{appointmentDate}</Text>
            </>
          ) : null}
        </Section>

        <Section>
          <Text style={smallHeading}>Co zawiera formularz</Text>
          <Text style={listItem}>• Podstawowe informacje o stanie zdrowia i przyjmowanych lekach</Text>
          <Text style={listItem}>• Historia zabiegów estetycznych i pielęgnacji</Text>
          <Text style={listItem}>• Twoje oczekiwania i obszary, na których chcesz się skupić</Text>
          <Text style={listItem}>• Ewentualne przeciwwskazania i alergie</Text>
        </Section>

        <Text style={text}>
          Wypełnienie formularza zajmie około <strong>5–10 minut</strong>.
          Wszystkie informacje są poufne i chronione zgodnie z RODO.
        </Text>

        <Section>
          <Button href={intakeFormUrl} style={buttonStyle}>
            Wypełnij formularz diagnostyczny
          </Button>
        </Section>

        <Text style={text}>
          Prosimy o wypełnienie formularza{' '}
          <strong>najpóźniej 24 godziny przed planowaną konsultacją</strong>,
          aby zespół miał czas na zapoznanie się z Twoją historią.
        </Text>

        <Hr style={hrStyle} />

        <Section>
          <Text style={text}>
            Jeśli link nie działa, skopiuj poniższy adres do przeglądarki:
            <br />
            <Link href={intakeFormUrl} style={linkStyle}>
              {intakeFormUrl}
            </Link>
          </Text>
          <Text style={text}>
            Masz pytania? Napisz na{' '}
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
            Do zobaczenia,
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
  component: ConsultationIntakeEmail,
  subject: 'Wypełnij formularz przed konsultacją — Beauty & Mind Clinic',
  displayName: 'Po zakupie konsultacji — formularz diagnostyczny',
  previewData: {
    name: 'Anna',
    consultationType: 'online',
    appointmentDate: '15 lipca 2026, 14:00',
    intakeFormUrl: 'https://bmclinics.ai/formularz-diagnostyczny?token=abc123',
  },
} satisfies TemplateEntry
