import { Redirect } from 'expo-router';
//в каждом файле должен быть index, но нам он не нужен, поэтому используем redirect

export default function TabIndex () {
  return <Redirect href={'/menu/'}/>
};