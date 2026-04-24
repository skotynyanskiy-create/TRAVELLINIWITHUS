import { useParams } from 'react-router-dom';
import DestinationHubLayout from '../components/hub/DestinationHubLayout';
import { getDestinationHub } from '../config/destinationHubs';
import NotFound from './NotFound';

interface DestinationHubPageProps {
  /** Se passato, bypassa useParams (compat con route legacy o uso esplicito). */
  country?: string;
}

export default function DestinationHubPage({ country }: DestinationHubPageProps) {
  const params = useParams();
  const slug = country || params.country || '';
  const hub = getDestinationHub(slug);

  if (!hub) {
    return <NotFound />;
  }

  return <DestinationHubLayout hub={hub} />;
}
