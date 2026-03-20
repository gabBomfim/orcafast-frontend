import { HStack, Button, Text, IconButton } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Pagination = ({ 
  currentPage, 
  lastPage, 
  onPageChange, 
  isLoading = false 
}) => {
  if (lastPage <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showPages = 5 // Quantidade de páginas visíveis

    if (lastPage <= showPages) {
      // Mostra todas as páginas se forem poucas
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para muitas páginas
      if (currentPage <= 3) {
        // Início
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(lastPage)
      } else if (currentPage >= lastPage - 2) {
        // Final
        pages.push(1)
        pages.push('...')
        for (let i = lastPage - 3; i <= lastPage; i++) {
          pages.push(i)
        }
      } else {
        // Meio
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(lastPage)
      }
    }

    return pages
  }

  return (
    <HStack justify="center" spacing={{ base: 1, md: 2 }}>
      <IconButton
        icon={<FiChevronLeft />}
        size={{ base: 'md', md: 'sm' }}
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1 || isLoading}
        aria-label="Página anterior"
        minW={{ base: '44px', md: '32px' }}
        h={{ base: '44px', md: '32px' }}
      />

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <Text key={`ellipsis-${index}`} px={1} color="gray.500" display={{ base: 'none', sm: 'block' }}>
              ...
            </Text>
          )
        }

        return (
          <Button
            key={page}
            size={{ base: 'md', md: 'sm' }}
            onClick={() => onPageChange(page)}
            colorScheme={currentPage === page ? 'emerald' : 'gray'}
            variant={currentPage === page ? 'solid' : 'outline'}
            isDisabled={isLoading}
            minW={{ base: '44px', md: '40px' }}
            h={{ base: '44px', md: '32px' }}
            display={
              // Em mobile, esconde páginas que não sejam a atual, anterior, próxima ou as extremas
              typeof page === 'number' &&
              page !== 1 &&
              page !== lastPage &&
              Math.abs(page - currentPage) > 1
                ? { base: 'none', sm: 'flex' }
                : 'flex'
            }
          >
            {page}
          </Button>
        )
      })}

      <IconButton
        icon={<FiChevronRight />}
        size={{ base: 'md', md: 'sm' }}
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === lastPage || isLoading}
        aria-label="Próxima página"
        minW={{ base: '44px', md: '32px' }}
        h={{ base: '44px', md: '32px' }}
      />
    </HStack>
  )
}

export default Pagination

