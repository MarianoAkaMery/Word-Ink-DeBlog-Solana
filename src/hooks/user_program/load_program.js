import { useMemo } from 'react';
import * as anchor from "@project-serum/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import myProgramIDL from '../../constants/myprogramidl.json'; 
import { BLOG_PROGRAM_KEY } from '../../constants'; 

const useProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    try {
      if (wallet && myProgramIDL && BLOG_PROGRAM_KEY) {
        const provider = new anchor.AnchorProvider(
          connection,
          wallet,
          anchor.AnchorProvider.defaultOptions()
        );
        return new anchor.Program(myProgramIDL, BLOG_PROGRAM_KEY, provider);
      }
    } catch (error) {
      console.error("Error initializing the program:", error);
    }
  }, [connection, wallet]);

  return program;
};

export default useProgram;
