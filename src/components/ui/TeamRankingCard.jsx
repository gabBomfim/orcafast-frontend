import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react'
import {
  FiAward,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDown,
  FiArrowUp,
} from 'react-icons/fi'

const BRAND_GRADIENT = 'linear-gradient(135deg, #00d97e 0%, #00b368 100%)'
const ZERO_BAR =
  'repeating-linear-gradient(135deg, #e2e8f0 0, #e2e8f0 4px, #f1f5f9 4px, #f1f5f9 8px)'

const FALLBACK_AVATAR_COLORS = [
  '#0ea5e9', '#a855f7', '#00d97e', '#f59e0b', '#ef4444', '#64748b',
  '#0d9488', '#db2777', '#7c3aed', '#16a34a', '#ea580c', '#0284c7',
]

const initialsFrom = (name) => {
  const parts = (name || '?').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const fmtBRL = (n) =>
  'R$ ' + Number(n || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const buildPropostasLink = (userId) =>
  `/dashboard/propostas?status=approved&user_ids%5B%5D=${userId}`

const TeamRankingCard = ({
  members = [],
  currentUserId,
  periodLabel = 'este mês',
  periodRange,
  onMemberClick,
}) => {
  const [metric, setMetric] = useState('fechados')
  const [showAll, setShowAll] = useState(false)

  const sortedAll = useMemo(() => {
    const key = metric === 'valor' ? 'valor' : 'fechados'
    return [...members].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0))
  }, [members, metric])

  const sorted = showAll ? sortedAll : sortedAll.slice(0, 5)
  const remaining = sortedAll.length - sorted.length
  const max = sortedAll[0]?.[metric === 'valor' ? 'valor' : 'fechados'] || 1
  const totalFechados = members.reduce((s, u) => s + (u.fechados || 0), 0)
  const totalValor = members.reduce((s, u) => s + (u.valor || 0), 0)
  const valueOf = (u) => (metric === 'valor' ? u.valor || 0 : u.fechados || 0)

  if (members.length === 0) return null

  return (
    <Card borderRadius="2xl" boxShadow="sm" border="1px" borderColor="gray.200">
      <CardBody p={{ base: 5, md: 6 }}>
        {/* Header */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 3, md: 4 }}
          mb={4}
          align={{ base: 'stretch', md: 'flex-start' }}
        >
          <HStack flex={1} spacing={3} align="flex-start">
            <Flex
              w={{ base: 9, md: 10 }}
              h={{ base: 9, md: 10 }}
              bg="emerald.50"
              borderRadius="xl"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={FiAward} w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} color="emerald.500" />
            </Flex>
            <Box minW={0}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" fontWeight="medium">
                Ranking do time
              </Text>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                color="gray.900"
                letterSpacing="-0.3px"
              >
                Quem mais fechou {periodLabel}
              </Text>
            </Box>
          </HStack>

          {/* Tabs */}
          <Box
            bg="gray.100"
            borderRadius="lg"
            p="3px"
            display="flex"
            gap="2px"
            w={{ base: 'full', md: 'auto' }}
            flexShrink={0}
          >
            {[
              { value: 'fechados', label: 'Quantidade' },
              { value: 'valor', label: 'Valor' },
            ].map((opt) => (
              <Box
                as="button"
                type="button"
                key={opt.value}
                onClick={() => setMetric(opt.value)}
                flex={{ base: 1, md: 'unset' }}
                h={{ base: '34px', md: '30px' }}
                px={3}
                borderRadius="md"
                fontSize={{ base: 'sm', md: 'xs' }}
                fontWeight="semibold"
                cursor="pointer"
                transition="all .15s ease"
                bg={metric === opt.value ? 'white' : 'transparent'}
                color={metric === opt.value ? 'gray.900' : 'gray.600'}
                boxShadow={metric === opt.value ? '0 1px 2px rgba(0,0,0,.06)' : 'none'}
              >
                {opt.label}
              </Box>
            ))}
          </Box>
        </Flex>

        {/* Stat strip */}
        <HStack
          spacing={2}
          mb={4}
          fontSize="xs"
          color="gray.500"
          flexWrap="wrap"
          rowGap={1}
        >
          <HStack
            spacing={1}
            px={2}
            py={1}
            borderRadius="md"
            bg="green.50"
            color="green.700"
            border="1px"
            borderColor="green.200"
            fontWeight="semibold"
            fontSize="11px"
          >
            <Icon as={FiCheckCircle} boxSize="11px" />
            <Text>{totalFechados} fechados</Text>
          </HStack>
          <Text>•</Text>
          <Text>{fmtBRL(totalValor)} no total</Text>
          {periodRange && (
            <>
              <Text color="gray.300">·</Text>
              <Text>{periodRange}</Text>
            </>
          )}
        </HStack>

        {/* Rows */}
        <VStack spacing="2px" align="stretch">
          {sorted.map((u, i) => {
            const v = valueOf(u)
            const pct = Math.max(4, (v / max) * 100)
            const isMe =
              currentUserId != null && String(u.id) === String(currentUserId)
            const isZero = v === 0
            const color = u.color || FALLBACK_AVATAR_COLORS[i % FALLBACK_AVATAR_COLORS.length]
            const initials = u.initials || initialsFrom(u.name)
            const handleClick = onMemberClick ? (e) => onMemberClick(e, u) : undefined

            return (
              <Box
                as={RouterLink}
                key={u.id}
                to={buildPropostasLink(u.id)}
                onClick={handleClick}
                title={`Ver orçamentos fechados de ${u.name}`}
                role="group"
                display="grid"
                gridTemplateColumns={{
                  base: '28px 36px 1fr auto',
                  md: '24px 32px 1fr auto auto',
                }}
                gridTemplateAreas={{
                  base: '"pos av name value" "pos av bar bar"',
                  md: 'unset',
                }}
                columnGap={{ base: '10px', md: '14px' }}
                rowGap={{ base: '4px', md: 0 }}
                alignItems="center"
                p={{ base: '12px 10px', md: '10px 10px' }}
                borderRadius="lg"
                border="1px solid transparent"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.200',
                  textDecoration: 'none',
                }}
                _active={{ bg: 'gray.50' }}
                transition="all .2s ease"
              >
                <Text
                  gridArea={{ base: 'pos', md: 'unset' }}
                  fontSize="sm"
                  fontWeight="bold"
                  color={i === 0 ? 'emerald.600' : 'gray.400'}
                  textAlign="center"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {i + 1}º
                </Text>

                <Flex
                  gridArea={{ base: 'av', md: 'unset' }}
                  w={{ base: 9, md: 8 }}
                  h={{ base: 9, md: 8 }}
                  borderRadius="full"
                  bg={color}
                  color="white"
                  fontWeight="bold"
                  fontSize={{ base: 'xs', md: '11px' }}
                  align="center"
                  justify="center"
                  flexShrink={0}
                  opacity={isZero ? 0.7 : 1}
                  letterSpacing=".3px"
                >
                  {initials}
                </Flex>

                {/* Name + desktop bar */}
                <Box gridArea={{ base: 'name', md: 'unset' }} minW={0}>
                  <HStack spacing={2} mb={{ base: 0, md: '6px' }} align="center">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={isZero ? 'gray.500' : 'gray.800'}
                      noOfLines={1}
                    >
                      {u.name}
                    </Text>
                    {isMe && (
                      <Box
                        fontSize="10px"
                        fontWeight="bold"
                        letterSpacing=".4px"
                        bg="emerald.50"
                        color="emerald.700"
                        px="6px"
                        py="2px"
                        borderRadius="sm"
                        border="1px"
                        borderColor="emerald.200"
                        flexShrink={0}
                      >
                        VOCÊ
                      </Box>
                    )}
                  </HStack>
                  <Box
                    display={{ base: 'none', md: 'block' }}
                    position="relative"
                    h="8px"
                    bg="gray.100"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      bottom={0}
                      left={0}
                      w={isZero ? '100%' : `${pct}%`}
                      borderRadius="full"
                      style={{
                        background: isZero ? ZERO_BAR : BRAND_GRADIENT,
                        opacity: isZero ? 0.6 : 1,
                      }}
                      transition="width .8s cubic-bezier(.2,.8,.2,1)"
                    />
                  </Box>
                </Box>

                {/* Mobile-only bar (full row) */}
                <Box
                  gridArea="bar"
                  display={{ base: 'block', md: 'none' }}
                  position="relative"
                  h="6px"
                  bg="gray.100"
                  borderRadius="full"
                  overflow="hidden"
                  alignSelf="center"
                >
                  <Box
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    w={isZero ? '100%' : `${pct}%`}
                    borderRadius="full"
                    style={{
                      background: isZero ? ZERO_BAR : BRAND_GRADIENT,
                      opacity: isZero ? 0.6 : 1,
                    }}
                  />
                </Box>

                {/* Right cell: value + meta */}
                <Flex
                  gridArea={{ base: 'value', md: 'unset' }}
                  direction={{ base: 'row', md: 'column' }}
                  align={{ base: 'baseline', md: 'flex-end' }}
                  gap={{ base: '6px', md: '2px' }}
                  minW={{ base: 0, md: '90px' }}
                  alignSelf="center"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={isZero ? 'gray.400' : 'gray.900'}
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                    letterSpacing="-0.2px"
                  >
                    {metric === 'valor' ? fmtBRL(v) : v}
                  </Text>
                  <Text
                    display={{ base: 'none', md: 'block' }}
                    fontSize="11px"
                    color="gray.500"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {isZero
                      ? 'Sem fechados'
                      : metric === 'valor'
                      ? `${u.fechados} fechados`
                      : fmtBRL(u.valor)}
                  </Text>
                </Flex>

                <Icon
                  as={FiArrowUpRight}
                  display={{ base: 'none', md: 'inline-flex' }}
                  boxSize="14px"
                  color="gray.300"
                  ml={2}
                  transition="all .2s ease"
                  _groupHover={{ color: 'emerald.500', transform: 'translateX(2px)' }}
                />
              </Box>
            )
          })}
        </VStack>

        {/* Footer */}
        <Flex
          mt={4}
          pt={3}
          borderTop="1px"
          borderColor="gray.100"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={3}
        >
          {remaining > 0 ? (
            <Box
              as="button"
              type="button"
              onClick={() => setShowAll(true)}
              fontSize="sm"
              fontWeight="semibold"
              color="emerald.600"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              p={{ base: '10px', md: 0 }}
              borderRadius="lg"
              bg={{ base: 'emerald.50', md: 'transparent' }}
              border={{ base: '1px solid', md: 'none' }}
              borderColor={{ base: 'emerald.200', md: 'transparent' }}
              cursor="pointer"
              _hover={{ color: 'emerald.700' }}
            >
              Ver todo o ranking
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                minW="20px"
                h="18px"
                px="5px"
                borderRadius="full"
                bg="emerald.500"
                color="white"
                fontSize="10px"
                fontWeight="bold"
                letterSpacing=".2px"
              >
                +{remaining}
              </Box>
              <Icon as={FiArrowDown} boxSize={3} />
            </Box>
          ) : showAll && sortedAll.length > 5 ? (
            <Box
              as="button"
              type="button"
              onClick={() => setShowAll(false)}
              fontSize="sm"
              fontWeight="semibold"
              color="emerald.600"
              display="inline-flex"
              alignItems="center"
              justifyContent={{ base: 'center', md: 'flex-start' }}
              gap={2}
              cursor="pointer"
              _hover={{ color: 'emerald.700' }}
            >
              Mostrar só os 5 primeiros
              <Icon as={FiArrowUp} boxSize={3} />
            </Box>
          ) : (
            <Box />
          )}
          <Text
            fontSize={{ base: '11px', md: 'xs' }}
            color="gray.500"
            textAlign={{ base: 'center', md: 'right' }}
          >
            Clique em um membro do time pra ver só os orçamentos fechados dele.
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default TeamRankingCard
