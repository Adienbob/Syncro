import { ReactNode, createContext, useReducer } from 'react';
import { initialState } from './initialState';
import { reducer } from './reducer';
import { Actions } from './actions';

type ContextType = {
   state: typeof initialState
   dispatch: React.Dispatch<Actions>;
}

export const AppContext = createContext<ContextType>({state: initialState, dispatch: () => null });

type Props = {
   children: ReactNode
}
export const AppProvider = ({children}: Props) => {
   const [state, dispatch] = useReducer(reducer, initialState);

   return (
      <AppContext.Provider value={{state, dispatch}}>
         {children}
      </AppContext.Provider>
   )
}