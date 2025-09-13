import DemoStyleForm from '@/components/DemoStyleForm';
import ClientOnly from '@/components/ClientOnly';

export default function Home() {
  return (
    <ClientOnly>
      <DemoStyleForm />
    </ClientOnly>
  );
}
