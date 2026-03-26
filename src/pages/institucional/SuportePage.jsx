import React from 'react';
import {
  Heading,
  Text,
  VStack,
  Divider,
  Box,
  Card,
  CardBody,
  HStack,
  Icon,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FiMail, FiClock } from 'react-icons/fi';
import LayoutInstitucional from './LayoutInstitucional';

const SuportePage = () => {
  return (
    <LayoutInstitucional>
      <VStack align="stretch" spacing={8}>
        {/* Cabeçalho */}
        <Box textAlign="center" py={4}>
          <Heading as="h1" size="xl" color="gray.900" mb={3}>
            Como podemos ajudar?
          </Heading>
          <Text color="gray.500">
            Encontre respostas rápidas ou entre em contato com nossa equipe.
          </Text>
        </Box>

        <Divider />

        {/* Card de Contato Direto */}
        <Card border="1px" borderColor="gray.100" shadow="sm" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={4} align="flex-start">
              <HStack spacing={3}>
                <Box p={2} bg="emerald.50" borderRadius="md">
                  <Icon as={FiMail} boxSize={6} color="emerald.500" />
                </Box>
                <Box>
                  <Heading as="h3" size="md" color="gray.900">
                    Atendimento via E-mail
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Para dúvidas financeiras, instabilidades críticas ou apoio com integrações.
                  </Text>
                </Box>
              </HStack>
              
              <Link 
                href="mailto:suporte@orcafast.com.br" 
                color="emerald.600" 
                fontWeight="semibold" 
                fontSize="lg"
                _hover={{ color: 'emerald.700', textDecoration: 'underline' }}
              >
                suporte@orcafast.com.br
              </Link>

              <HStack spacing={2} color="orange.500" bg="orange.50" px={3} py={1} borderRadius="full">
                <Icon as={FiClock} boxSize={4} />
                <Text fontSize="xs" fontWeight="medium">
                  SLA de Resposta: Até 24 horas úteis.
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* FAQ - Perguntas Frequentes */}
        <Box mt={6}>
          <Heading as="h2" size="lg" color="gray.900" mb={6}>
            Perguntas Frequentes (FAQ)
          </Heading>
          
          <Accordion allowMultiple borderRadius="xl" bg="white" border="1px" borderColor="gray.100" overflow="hidden">
            <AccordionItem border="none" borderBottom="1px" borderColor="gray.100">
              <AccordionButton p={5} _hover={{ bg: 'gray.50' }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold" color="gray.800">
                  1. Como cancelo minha assinatura?
                </Box>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={6} px={5} color="gray.600" lineHeight="tall">
                Você pode cancelar sua assinatura a qualquer momento e sem taxas escondidas. Basta acessar as suas "Configurações" {' > '} "Assinatura" usando o menu lateral da aplicação e clicar na opção de encerramento temporário. A fatura mensal corrente será honrada e o acesso garantido até o último dia pago, não procedendo no mês subsequente.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none" borderBottom="1px" borderColor="gray.100">
              <AccordionButton p={5} _hover={{ bg: 'gray.50' }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold" color="gray.800">
                  2. Como o cliente aprova meu orçamento?
                </Box>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={6} px={5} color="gray.600" lineHeight="tall">
                O fluxo de aprovação é desobstruído e mágico! Após você enviar o "Link do Orçamento" (Copiar Link ou WhatsApp), o cliente final tem a visão do seu orçamento formatado com a sua logomarca. Contribui para a jornada dele ler com atenção as descrições em tela inteira (celular ou PC) e simplesmente clicar na call-to-action verde no fundo inferior “Aprovar”. O status cairá automaticamente no seu painel principal sem precisar nem de mensagem!
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none" borderBottom="1px" borderColor="gray.100">
              <AccordionButton p={5} _hover={{ bg: 'gray.50' }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold" color="gray.800">
                  3. Os anexos em PDFs têm rastreamento de visualização?
                </Box>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={6} px={5} color="gray.600" lineHeight="tall">
                <strong>Não.</strong> Documentos impressos por via digital (PDF, Docx) comportam uma tecnologia passiva e morta de download — não possuem código web vivo que permita os disparos do sistema de métrica. <strong>Apenas o link web gerado no botão "Envio Mágico no WhatsApp" e o clique de "Cópia Simples"</strong> contêm rastreamento do engajamento em tempo real sob o selo indicativo da "Visualização". Dê sempre a primazia em compartilhar o Web Link!
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton p={5} _hover={{ bg: 'gray.50' }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold" color="gray.800">
                  4. Esqueci minha senha, o que fazer?
                </Box>
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pb={6} px={5} color="gray.600" lineHeight="tall">
                Na página de login (app.orcafast.com.br/login), clique no link secundário escrito <strong>"Esqueci minha senha"</strong> logo abaixo do campo principal. Enviaremos um código criptografado, válido por um prazo fechado, para o seu endereço de e-mail seguro registrado (cheque o SPAM). Basta abrir a URL secreta no corpo do e-mail para escolher sua nova credencial em total segurança.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </VStack>
    </LayoutInstitucional>
  );
};

export default SuportePage;
