import { AppDataSource } from '../config/database'; 
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export const hashPasswords = async (mot:string)=> {
  try{
    const ret =  await bcrypt.hash(mot,12);
    return ret;
  }catch (er){
    console.log(er)
  }
    

    
}

export async function decodeEtCompare(mot1:string,mot2: string) {
  return await bcrypt.compare(mot1,mot2)
}
