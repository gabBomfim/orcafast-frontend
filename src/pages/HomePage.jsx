import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Badge,
  Grid,
  Flex,
  Card,
  CardBody,
  Heading,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import {
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiUsers,
  FiSend,
  FiEye,
  FiDollarSign,
  FiBarChart,
  FiTarget,
  FiShield,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi'

const HomePage = () => {
  return (
    <Box minH="100vh">
      {/* Header */}
      <Box
        as="header"
        borderBottom="1px"
        borderColor="gray.200"
        position="sticky"
        top="0"
        zIndex="50"
        backdropFilter="blur(8px)"
        bg="rgba(255, 255, 255, 0.95)"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiZap} color="white" boxSize={5} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                OrçaFast
              </Text>
            </HStack>

            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              <Text
                as="a"
                href="#como-funciona"
                color="gray.600"
                _hover={{ color: 'gray.900' }}
                fontWeight="medium"
                cursor="pointer"
              >
                Como funciona
              </Text>
              <Text
                as="a"
                href="#precos"
                color="gray.600"
                _hover={{ color: 'gray.900' }}
                fontWeight="medium"
                cursor="pointer"
              >
                Preços
              </Text>
              <Text
                as="a"
                href="#contato"
                color="gray.600"
                _hover={{ color: 'gray.900' }}
                fontWeight="medium"
                cursor="pointer"
              >
                Contato
              </Text>
            </HStack>

            <HStack spacing={4}>
              <Button
                as={Link}
                to="/dashboard"
                variant="ghost"
                color="gray.600"
                _hover={{ color: 'gray.900' }}
                fontWeight="medium"
              >
                Entrar
              </Button>
              <Button
                as={Link}
                to="/dashboard"
                bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                _hover={{ bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                color="white"
                fontWeight="semibold"
                px={6}
                borderRadius="lg"
                boxShadow="sm"
              >
                Começar grátis
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box py={32} px={6} bg="white">
        <Container maxW="container.xl" textAlign="center">
          <Badge
            mb={8}
            bg="emerald.50"
            color="emerald.700"
            borderColor="emerald.200"
            fontWeight="medium"
            px={6}
            py={3}
            fontSize="base"
            borderRadius="full"
            border="1px"
          >
            ✨ Mais de 1.000 propostas enviadas este mês
          </Badge>

          <VStack spacing={10}>
            <Box>
              <Text
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontWeight="bold"
                lineHeight="tight"
                color="gray.900"
              >
                Orça rápido,
                <br />
                <Text
                  as="span"
                  bgGradient="linear(to-r, emerald.600, emerald.500)"
                  bgClip="text"
                >
                  fecha fácil
                </Text>
              </Text>
            </Box>

            <Text
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
              color="gray.600"
              maxW="4xl"
              lineHeight="relaxed"
              fontWeight="light"
            >
              A plataforma mais simples para criar, enviar e acompanhar propostas
              profissionais. Sem enrolação, sem complexidade.
            </Text>

            <VStack spacing={6}>
              <HStack spacing={6} flexWrap="wrap" justify="center">
                <Button
                  as={Link}
                  to="/dashboard"
                  size="lg"
                  bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                  _hover={{ bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                  color="white"
                  fontSize="xl"
                  px={16}
                  py={6}
                  fontWeight="semibold"
                  borderRadius="2xl"
                  boxShadow="lg"
                  transition="all 0.2s"
                  rightIcon={<Icon as={FiArrowRight} boxSize={6} />}
                  _hover={{ 
                    bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    boxShadow: 'xl' 
                  }}
                >
                  Começar grátis
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  color="gray.700"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400', bg: 'gray.50' }}
                  fontSize="xl"
                  px={16}
                  py={6}
                  fontWeight="semibold"
                  borderRadius="2xl"
                  borderWidth="2px"
                >
                  Ver demonstração
                </Button>
              </HStack>

              <HStack
                spacing={12}
                fontSize="lg"
                color="gray.600"
                flexWrap="wrap"
                justify="center"
              >
                <HStack>
                  <Icon as={FiCheckCircle} color="emerald.600" boxSize={6} />
                  <Text>Grátis para sempre</Text>
                </HStack>
                <HStack>
                  <Icon as={FiCheckCircle} color="emerald.600" boxSize={6} />
                  <Text>Sem cartão de crédito</Text>
                </HStack>
                <HStack>
                  <Icon as={FiCheckCircle} color="emerald.600" boxSize={6} />
                  <Text>Pronto em 2 minutos</Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={24} bg="gray.900">
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={16} textAlign="center">
            <VStack spacing={4}>
              <Text fontSize="5xl" fontWeight="bold" color="white">
                3 cliques
              </Text>
              <Text color="gray.300" fontSize="lg">
                Para enviar proposta
              </Text>
            </VStack>
            <VStack spacing={4}>
              <Text fontSize="5xl" fontWeight="bold" color="white">
                2 min
              </Text>
              <Text color="gray.300" fontSize="lg">
                Tempo médio de setup
              </Text>
            </VStack>
            <VStack spacing={4}>
              <Text fontSize="5xl" fontWeight="bold" color="white">
                85%
              </Text>
              <Text color="gray.300" fontSize="lg">
                Taxa de aprovação
              </Text>
            </VStack>
            <VStack spacing={4}>
              <Text fontSize="5xl" fontWeight="bold" color="emerald.400">
                R$ 29
              </Text>
              <Text color="gray.300" fontSize="lg">
                Plano Pro por mês
              </Text>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* How it Works */}
      <Box id="como-funciona" py={32} px={6} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={24}>
            <Box textAlign="center">
              <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="bold" mb={8} color="gray.900">
                Como funciona
              </Text>
              <Text fontSize="2xl" color="gray.600" maxW="3xl">
                Processo simples em 4 etapas para fechar mais negócios
              </Text>
            </Box>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={12}>
              {[
                { icon: FiUsers, step: 1, title: 'Criar', desc: 'Cadastre clientes e crie propostas profissionais em minutos' },
                { icon: FiSend, step: 2, title: 'Enviar', desc: 'Compartilhe por WhatsApp, email ou link direto' },
                { icon: FiEye, step: 3, title: 'Acompanhar', desc: 'Veja quando foi visualizada e receba notificações' },
                { icon: FiDollarSign, step: 4, title: 'Ser pago', desc: 'Cliente aprova e você recebe o pagamento' },
              ].map((item) => (
                <VStack key={item.step} textAlign="center" spacing={6}>
                  <Box
                    w={20}
                    h={20}
                    bg="emerald.100"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={item.icon} color="emerald.600" boxSize={10} />
                  </Box>
                  <Box
                    w={12}
                    h={12}
                    bg="emerald.600"
                    color="white"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    {item.step}
                  </Box>
                  <Text fontSize="2xl" fontWeight="semibold" color="gray.900">
                    {item.title}
                  </Text>
                  <Text color="gray.600" lineHeight="relaxed" fontSize="lg">
                    {item.desc}
                  </Text>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Dashboard Features */}
      <Box py={32} px={6} bg="gray.900">
        <Container maxW="container.xl">
          <VStack spacing={20}>
            <Box textAlign="center">
              <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="bold" mb={8} color="white">
                Dashboard que funciona
              </Text>
              <Text fontSize="2xl" color="gray.300" maxW="3xl">
                Acompanhe suas métricas e tome decisões baseadas em dados reais
              </Text>
            </Box>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              {[
                { icon: FiBarChart, title: 'Métricas em tempo real', desc: 'Visualize aprovações, valores e performance das suas propostas' },
                { icon: FiTarget, title: 'Controle total', desc: 'Gerencie clientes, propostas e pagamentos em um só lugar' },
                { icon: FiShield, title: 'Dados seguros', desc: 'Suas informações protegidas com criptografia de ponta' },
              ].map((item, index) => (
                <Card key={index} bg="gray.800" borderColor="gray.700" p={8}>
                  <CardBody textAlign="center" p={0}>
                    <Box
                      w={16}
                      h={16}
                      bg="rgba(16, 185, 129, 0.2)"
                      borderRadius="2xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mx="auto"
                      mb={6}
                    >
                      <Icon as={item.icon} color="emerald.400" boxSize={8} />
                    </Box>
                    <Heading size="lg" color="white" mb={4}>
                      {item.title}
                    </Heading>
                    <Text color="gray.300" fontSize="lg" lineHeight="relaxed">
                      {item.desc}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="precos" py={32} px={6} bg="gray.900">
        <Container maxW="container.xl">
          <VStack spacing={24}>
            <Box textAlign="center">
              <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="bold" mb={8} color="white">
                Preços simples e transparentes
              </Text>
              <Text fontSize="2xl" color="gray.300">
                Comece grátis e evolua conforme seu negócio cresce
              </Text>
            </Box>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              {/* Plano Gratuito */}
              <Card bg="gray.800" borderColor="gray.700" _hover={{ borderColor: 'gray.600' }} transition="all 0.2s" boxShadow="xl">
                <CardBody textAlign="center" p={8}>
                  <VStack spacing={6}>
                    <Box>
                      <Heading size="lg" color="white" fontWeight="semibold" mb={6}>
                        Gratuito
                      </Heading>
                      <Text fontSize="6xl" fontWeight="bold" color="white">
                        R$ 0
                      </Text>
                      <Text color="gray.300" fontSize="lg" mt={4}>
                        Para começar
                      </Text>
                    </Box>

                    <VStack spacing={6} align="stretch">
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Até 5 propostas/mês</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Templates básicos</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Suporte por email</Text>
                      </HStack>
                    </VStack>

                    <Button
                      as={Link}
                      to="/dashboard"
                      variant="outline"
                      w="full"
                      mt={10}
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      bg="transparent"
                      color="white"
                      py={4}
                      fontSize="lg"
                      fontWeight="semibold"
                      borderRadius="xl"
                    >
                      Começar grátis
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Plano Pro - Mais Popular */}
              <Box position="relative">
                <Box
                  position="absolute"
                  top="-6"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex="10"
                >
                  <Badge
                    bg="white"
                    color="emerald.700"
                    px={6}
                    py={3}
                    fontSize="base"
                    fontWeight="bold"
                    borderRadius="full"
                  >
                    Mais popular
                  </Badge>
                </Box>
                <Card
                                  bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                  borderColor="emerald.500"
                  boxShadow="2xl"
                  transform="scale(1.05)"
                >
                  <CardBody textAlign="center" p={8}>
                    <VStack spacing={6}>
                      <Box>
                        <Heading size="lg" color="white" fontWeight="semibold" mb={6}>
                          Pro
                        </Heading>
                        <Text fontSize="6xl" fontWeight="bold" color="white">
                          R$ 29
                        </Text>
                        <Text color="emerald.100" fontSize="lg" mt={4}>
                          Por mês
                        </Text>
                      </Box>

                      <VStack spacing={6} align="stretch">
                        <HStack>
                          <Icon as={FiCheckCircle} color="white" boxSize={6} flexShrink={0} />
                          <Text color="white" fontSize="lg">Propostas ilimitadas</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiCheckCircle} color="white" boxSize={6} flexShrink={0} />
                          <Text color="white" fontSize="lg">Sem marca OrçaFast</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiCheckCircle} color="white" boxSize={6} flexShrink={0} />
                          <Text color="white" fontSize="lg">Dashboard completo</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiCheckCircle} color="white" boxSize={6} flexShrink={0} />
                          <Text color="white" fontSize="lg">Suporte prioritário</Text>
                        </HStack>
                      </VStack>

                      <Button
                        as={Link}
                        to="/dashboard"
                        w="full"
                        mt={10}
                        bg="white"
                        _hover={{ bg: 'gray.100' }}
                        color="emerald.700"
                        py={4}
                        fontSize="lg"
                        fontWeight="bold"
                        boxShadow="lg"
                        borderRadius="xl"
                      >
                        Começar teste grátis
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>

              {/* Plano Business */}
              <Card bg="gray.800" borderColor="gray.700" _hover={{ borderColor: 'gray.600' }} transition="all 0.2s" boxShadow="xl">
                <CardBody textAlign="center" p={8}>
                  <VStack spacing={6}>
                    <Box>
                      <Heading size="lg" color="white" fontWeight="semibold" mb={6}>
                        Business
                      </Heading>
                      <Text fontSize="6xl" fontWeight="bold" color="white">
                        R$ 59
                      </Text>
                      <Text color="gray.300" fontSize="lg" mt={4}>
                        Para equipes
                      </Text>
                    </Box>

                    <VStack spacing={6} align="stretch">
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Tudo do Pro</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Até 5 usuários</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">Templates customizados</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="emerald.400" boxSize={6} flexShrink={0} />
                        <Text color="gray.200" fontSize="lg">API integração</Text>
                      </HStack>
                    </VStack>

                    <Button
                      variant="outline"
                      w="full"
                      mt={10}
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      bg="transparent"
                      color="white"
                      py={4}
                      fontSize="lg"
                      fontWeight="semibold"
                      borderRadius="xl"
                    >
                      Falar com vendas
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={32} px={6} bg="gray.900">
        <Container maxW="container.lg" textAlign="center">
          <VStack spacing={16}>
            <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="bold" color="white">
              Pronto para aumentar suas aprovações?
            </Text>
            <Text fontSize="2xl" color="gray.300" maxW="3xl">
              Junte-se a mais de 1.000 profissionais que já usam o OrçaFast para
              fechar mais negócios
            </Text>
            <Button
              as={Link}
              to="/dashboard"
              size="lg"
              bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
              _hover={{ bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
              color="white"
              fontSize="2xl"
              px={20}
              py={8}
              fontWeight="bold"
              borderRadius="2xl"
              boxShadow="2xl"
              transition="all 0.2s"
              rightIcon={<Icon as={FiArrowRight} boxSize={8} />}
              _hover={{ 
                bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '3xl' 
              }}
            >
              Começar grátis agora
            </Button>
            <Text fontSize="lg" color="gray.400">
              Sem cartão de crédito • Configuração em 2 minutos • Suporte em
              português
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTop="1px" borderColor="gray.200" bg="gray.50" py={20} px={6}>
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
          >
            <HStack spacing={3} mb={{ base: 8, md: 0 }}>
              <Box
                w={12}
                h={12}
                bg="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiZap} color="white" boxSize={7} />
              </Box>
              <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                OrçaFast
              </Text>
            </HStack>

            <HStack spacing={10} fontSize="lg" color="gray.600">
              <Text as="a" href="#" _hover={{ color: 'gray.900' }} cursor="pointer">
                Termos de uso
              </Text>
              <Text as="a" href="#" _hover={{ color: 'gray.900' }} cursor="pointer">
                Privacidade
              </Text>
              <Text as="a" href="#" _hover={{ color: 'gray.900' }} cursor="pointer">
                Suporte
              </Text>
            </HStack>
          </Flex>

          <Box
            borderTop="1px"
            borderColor="gray.200"
            mt={16}
            pt={10}
            textAlign="center"
            fontSize="lg"
            color="gray.500"
          >
            © 2024 OrçaFast. Todos os direitos reservados.
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
