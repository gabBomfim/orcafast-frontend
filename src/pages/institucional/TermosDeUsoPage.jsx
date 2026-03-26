import React from 'react';
import { Heading, Text, VStack, Divider, Box } from '@chakra-ui/react';
import LayoutInstitucional from './LayoutInstitucional';

const TermosDeUsoPage = () => {
  return (
    <LayoutInstitucional>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading as="h1" size="xl" color="gray.900" mb={2}>
            Termos de Uso
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Última atualização: 15 de Março de 2026
          </Text>
        </Box>
        
        <Divider />

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            1. Natureza do Serviço
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            A <strong>OrçaFast</strong> ("Nós", "Plataforma" ou "Sistema") é um software na modalidade SaaS (Software as a Service) voltado exclusivamente para a criação, envio e gestão de orçamentos.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>1.1. Limitação de Responsabilidade Financeira:</strong> A OrçaFast fornecerá as ferramentas de tecnologia para apresentação comercial e rastreamento de cliques. <strong>NÓS NÃO SOMOS</strong> uma instituição financeira, arranjo de pagamento, sistema de cobrança ou intermediadores de negócio.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>1.2. Risco do Negócio:</strong> Não garantimos o fechamento de orçamentos enviados através do sistema. Caso o cliente final do Usuário ("Seu Cliente") aprove o orçamento digitalmente através do nosso link, mas não honre com o pagamento do serviço contratado, a OrçaFast não possui nenhuma responsabilidade solidária, subsidiária ou penal sobre o inadimplemento. O risco de crédito e prestação do serviço é única e exclusivamente entre o Usuário e seu cliente.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            2. Planos e Assinaturas
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>2.1. Modelos de Assinatura:</strong> O sistema opera sob um modelo de assinatura de licença de uso temporário (Planos Autônomo e Equipe), processados de forma segura e internacionalmente reconhecida pela plataforma <strong>Stripe</strong>.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>2.2. Renovações e Cancelamento:</strong> As cobranças são recorrentes e renovadas automaticamente. O Usuário pode solicitar ou efetuar o cancelamento a qualquer momento diretamente no seu painel de configurações. 
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>2.3. Política de Reembolso:</strong> O cancelamento suspende as cobranças futuras, garantindo o acesso até o fim do ciclo já pago. Não oferecemos reembolso pro rata de dias não utilizados e não fazemos estornos compensatórios em virtude de esquecimentos de cancelamento.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            3. Disponibilidade e Perda de Dados
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>3.1. Infraestrutura em Nuvem:</strong> Nossa operação é hospedada em infraestrutura de nuvem com data centers na Europa (Hetzner). Nós empregamos esforços comerciais razoáveis ("Best Effort") para manter a plataforma no ar 99,9% do tempo.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>3.2. Isenção de Uptime:</strong> Interrupções podem ocorrer devido a manutenções programadas, falhas de rede de terceiros, atualizações ou motivos de força maior. O Usuário concorda que a OrçaFast não será responsabilizada por qualquer perda de receita (lucros cessantes) ou danos diretos e indiretos associados à indisponibilidade temporária do serviço.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>3.3. Backup e Retenção:</strong> Realizamos rotinas de backup; todavia, encorajamos que o Usuário baixe cópias em PDF de orçamentos vitais, não podendo nos imputar o dever legal de guarda e espelhamento vitalício (archive) após a exclusão da conta ou inadimplência da mensalidade.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            4. Conduta do Usuário
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            Ao utilizar a OrçaFast, você concorda expressamente <strong>NÃO</strong>:
          </Text>
          <Box as="ul" pl={6} color="gray.600" spacing={2}>
            <li>Utilizar o sistema para aplicar fraudes, golpes comerciais ou "Phishing".</li>
            <li>Praticar envio massivo de orçamentos indesejados (SPAM) utilizando nossa infraestrutura de links e emails.</li>
            <li>Injetar, transmitir ou armazenar códigos maliciosos, vírus e imagens ofensivas nos campos de cadastro e descrições.</li>
            <li>Vender, sublicenciar ou redistribuir as nossas ferramentas sem nossa prévia autorização.</li>
          </Box>
          <Text color="gray.600" mt={4} lineHeight="tall">
            Identificando violações destas diretrizes, a OrçaFast reserva-se o absoluto direito de suspender ou encerrar imediatamente a sua conta, sem aviso prévio e sem direito a reembolso de qualquer quantia paga.
          </Text>
        </Box>

      </VStack>
    </LayoutInstitucional>
  );
};

export default TermosDeUsoPage;
