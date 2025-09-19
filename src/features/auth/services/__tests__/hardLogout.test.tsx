import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performHardLogout, setupCrossTabLogoutListener } from '../../../utils/hardLogout';

// Mock Supabase
const mockSignOut = vi.fn();
const mockRemoveAllChannels = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: mockSignOut,
    },
    removeAllChannels: mockRemoveAllChannels,
  },
}));

// Mock logger
vi.mock('@/services/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    clearUserContext: vi.fn(),
  },
}));

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor(public name: string) {}
  postMessage = vi.fn();
  close = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

const originalBroadcastChannel = global.BroadcastChannel;

describe('hardLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.BroadcastChannel = MockBroadcastChannel as any;
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
        keys: vi.fn().mockReturnValue([
          'sb-test-auth-token',
          'supabase.auth.token',
          'other-key'
        ]),
      },
      writable: true,
    });

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock Object.keys for localStorage
    vi.spyOn(Object, 'keys').mockReturnValue([
      'sb-test-auth-token',
      'supabase.auth.token',
      'other-key'
    ]);
  });

  afterEach(() => {
    global.BroadcastChannel = originalBroadcastChannel;
    vi.restoreAllMocks();
  });

  describe('performHardLogout', () => {
    it('calls supabase signOut with global scope', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await performHardLogout();

      expect(mockSignOut).toHaveBeenCalledWith({ scope: 'global' });
    });

    it('removes supabase auth tokens from localStorage', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await performHardLogout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('sb-test-auth-token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('supabase.auth.token');
      expect(localStorage.removeItem).not.toHaveBeenCalledWith('other-key');
    });

    it('clears sessionStorage', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await performHardLogout();

      expect(sessionStorage.clear).toHaveBeenCalled();
    });

    it('closes realtime connections', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await performHardLogout();

      expect(mockRemoveAllChannels).toHaveBeenCalled();
    });

    it('continues cleanup even if signOut fails', async () => {
      mockSignOut.mockRejectedValue(new Error('Network error'));

      await performHardLogout();

      // Should still clean up storage
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(mockRemoveAllChannels).toHaveBeenCalled();
    });

    it('broadcasts logout to other tabs', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await performHardLogout();

      // Check that BroadcastChannel was created and used
      expect(MockBroadcastChannel.prototype.postMessage).toHaveBeenCalledWith({
        type: 'HARD_LOGOUT',
        timestamp: expect.any(Number),
        origin: window.location.origin,
      });
    });
  });

  describe('setupCrossTabLogoutListener', () => {
    it('sets up broadcast channel listener', () => {
      const mockCallback = vi.fn();
      
      const cleanup = setupCrossTabLogoutListener(mockCallback);

      expect(cleanup).toBeTypeOf('function');
      expect(MockBroadcastChannel.prototype.addEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
    });

    it('calls callback when logout message received', () => {
      const mockCallback = vi.fn();
      let messageHandler: (event: MessageEvent) => void;
      
      MockBroadcastChannel.prototype.addEventListener = vi.fn().mockImplementation((type, handler) => {
        if (type === 'message') {
          messageHandler = handler;
        }
      });

      setupCrossTabLogoutListener(mockCallback);

      // Simulate receiving a logout message
      const mockEvent = {
        data: { type: 'HARD_LOGOUT' }
      } as MessageEvent;

      messageHandler!(mockEvent);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('returns cleanup function that removes listeners', () => {
      const mockCallback = vi.fn();
      
      const cleanup = setupCrossTabLogoutListener(mockCallback);
      cleanup();

      expect(MockBroadcastChannel.prototype.removeEventListener).toHaveBeenCalled();
      expect(MockBroadcastChannel.prototype.close).toHaveBeenCalled();
    });
  });
});