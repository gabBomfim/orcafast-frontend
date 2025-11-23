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
    <HStack justify="center" spacing={2}>
      <IconButton
        icon={<FiChevronLeft />}
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1 || isLoading}
        aria-label="Página anterior"
      />

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <Text key={`ellipsis-${index}`} px={2} color="gray.500">
              ...
            </Text>
          )
        }

        return (
          <Button
            key={page}
            size="sm"
            onClick={() => onPageChange(page)}
            colorScheme={currentPage === page ? 'emerald' : 'gray'}
            variant={currentPage === page ? 'solid' : 'outline'}
            isDisabled={isLoading}
            minW="40px"
          >
            {page}
          </Button>
        )
      })}

      <IconButton
        icon={<FiChevronRight />}
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === lastPage || isLoading}
        aria-label="Próxima página"
      />
    </HStack>
  )
}

export default Pagination

