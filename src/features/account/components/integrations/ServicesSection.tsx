import React, { useCallback } from 'react';
import { Database, AlertCircle as AlertIcon } from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatDate } from '@/shared/utils/date';
import {
  useServices,
  useConnectService,
  useDisconnectService
} from '@/shared/hooks/api/useAccountData';

const ServicesSection: React.FC = () => {
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices();
  const connectService = useConnectService();
  const disconnectService = useDisconnectService();

  const handleConnectService = useCallback((serviceId: string) => {
    connectService.mutate(serviceId);
  }, [connectService]);

  const handleDisconnectService = useCallback((serviceId: string) => {
    disconnectService.mutate(serviceId);
  }, [disconnectService]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallbackSvg = document.createElement('div');
    fallbackSvg.innerHTML = `<svg class="w-5 h-5 text-gray-100" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.201 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418z"/>
    </svg>`;
    target.parentNode?.appendChild(fallbackSvg.firstChild!);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Connect third-party services to enhance your workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {servicesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : servicesError ? (
          <div className="text-center py-8">
            <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-600">{getErrorMessage(servicesError)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map((service) => (
              <div
                key={service.id}
                className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {service.icon_url ? (
                    <img src={service.icon_url} alt={service.name} className="w-8 h-8 rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                      {service.name === 'Discord' ? (
                        <img
                          src="https://img.icons8.com/?size=100&id=30888&format=png&color=1A1A1A"
                          alt="Discord"
                          className="w-5 h-5"
                          onError={handleImageError}
                        />
                      ) : (
                        <Database className="w-4 h-4 text-gray-100" />
                      )}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                    {service.connected && service.last_sync && (
                      <div className="text-xs text-gray-400">
                        Last sync: {formatDate(service.last_sync)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {service.connected ? (
                    <>
                      <StatusBadge status="active" className="text-xs" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDisconnectService(service.id)}
                        disabled={disconnectService.isPending}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnectService(service.id)}
                      disabled={connectService.isPending}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )) || (
              <div className="col-span-2 text-center py-8">
                <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No services available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(ServicesSection);