import { createContainer } from 'unstated-next'

interface useSystemProps {
  test: string
}

function useSystem(): useSystemProps {
  return {
    test: '1',
  }
}

const System = createContainer(useSystem)

export default System
