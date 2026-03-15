import React from 'react';
import { Heading, Text, VStack, Divider, Box } from '@chakra-ui/react';
import LayoutInstitucional from './LayoutInstitucional';

const PoliticaPrivacidadePage = () => {
  return (
    <LayoutInstitucional>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading as="h1" size="xl" color="gray.900" mb={2}>
            Política de Privacidade
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Última atualização: 15 de Março de 2026
          </Text>
        </Box>
        
        <Divider />

        <Box>
          <Text color="gray.600" mb={4} lineHeight="tall">
            Esta Política de Privacidade descreve como a <strong>OrçaFast</strong> coleta, utiliza e protege suas informações pessoais à luz da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            1. Dados do Usuário (Nossos Clientes Cadastrados)
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>1.1. Coleta Direta:</strong> Para o fornecimento do SaaS, a OrçaFast atua como Controladora dos dados dos Usuários. Nós coletamos apenas as informações absolutamente essenciais à prestação do serviço e cobrança: nome, e-mail e informações financeiras fornecidas diretamente à nossa infraestrutura no ato do cadastro.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>1.2. Segurança e Criptografia:</strong> Empreendemos criptografia forte em todo o tráfego da aplicação (TLS). As senhas armazenadas nos nossos bancos de dados são anonimizadas usando algoritmos de codificação reversa Hash (bcrypt/argon2), blindando suas credenciais com "Salt" randômico para evitar decodificações não autorizadas.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            2. Dados de Terceiros (Clientes do Usuário)
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>2.1. O Operador e o Controlador:</strong> Você, Usuário, utiliza a Plataforma para inserir dados, criar e enviar orçamentos referentes aos seus negócios. Você é o "Controlador" absoluto sob a óptica da LGPD para com esses dados. A OrçaFast detém estritamente o papel de <strong>"Operador"</strong> técnico e hospedagem.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>2.2. O seu Consentimento:</strong> Toda a responsabilidade de dispor de Bases Legais aplicáveis (legítimo interesse, consentimento livre e informado) para inserir nomes, telefones, e-mails, endereços dos seus clientes - bem como descrever serviços ou itens dentro dos orçamentos - dentro da plataforma OrçaFast, recai inteiramente sobre você (Usuário Contratante).
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mb={3}>
            3. Infraestrutura e Compartilhamento de Dados Internacionais
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>3.1. Provedores de Serviço Necessários:</strong> Para que toda a tecnologia e orquestração SaaS funcionem fluidamente, compartilhamos dados pontuais em regime de minimização com parceiros estratégicos que detêm as certificações de segurança (SOC2, ISO27001):
          </Text>
          <Box as="ul" pl={6} color="gray.600" spacing={3}>
            <li><strong>Stripe:</strong> O Maior Gateway do Mundo para pagamentos e renovações do sistema. Não interceptamos nem guardamos CVV de Cartões de Créditos diretamente em nossas tabelas. Os seus repasses financeiros transitam na rede hiper-segura PCI-DSS do Stripe.</li>
            <li><strong>Resend:</strong> Ferramenta mundial encarregada do disparo instantâneo (SMTP/API) de e-mails transacionais.</li>
            <li><strong>Hetzner:</strong> Contratos em nuvem alocados na infraestrutura europeia (Alemanha/Finlândia), que está sujeita à dura regulação do bloco do GDPR – precursora mundial das regras replicadas pela LGPD no Brasil. Suas logos, textos, e estrutura de dados estão hospedadas nos seus provedores de nuvem de alta segurança.</li>
          </Box>
        </Box>

        <Box>
          <Heading as="h2" size="md" color="gray.900" mt={6} mb={3}>
            4. Seus Direitos (Garantias do Titular)
          </Heading>
          <Text color="gray.600" mb={4} lineHeight="tall">
            O respeito pela privacidade é o núcleo dessa Plataforma. O Usuário poderá sempre acessar, rever, interpelar e modificar seus endereços, nome de registro e demais dados do perfil dentro do seu painel logado no OrçaFast.
          </Text>
          <Text color="gray.600" mb={4} lineHeight="tall">
            <strong>DIREITO DE EXCLUSÃO (Right to be Forgotten):</strong> Se a qualquer instante decidir deixar de utilizar nossos serviços, o Usuário não precisa ter "burocracias" ou invocar tickets gigantes. Mediante confirmação e cancelamento das faturas recorrentes da licença pendentes, o Usuário detém o direito à Exclusão Definitiva dos seus rastros, cadastros e metadados nas nossas planilhas e bases da nuvem – excetuando os de estrita finalidade fisco-tributária ou compliance sob o prazo de prescrição legal em vigência no Brasil.
          </Text>
        </Box>
      </VStack>
    </LayoutInstitucional>
  );
};

export default PoliticaPrivacidadePage;
