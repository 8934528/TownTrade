import { useState, useEffect, useCallback } from 'react';
import { businessesService } from '../../../services/businesses';
import { messagesService } from '../../../services/messages';
import type { Business, Message } from '../../../types';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CommunicationsProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Communications = ({ showNotification }: CommunicationsProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'sent' | 'directory'>('inbox');
  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [newTag, setNewTag] = useState('');

  const fetchMyBusinessAndBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const myBiz = await businessesService.getMyBusiness();
      setMyBusiness(myBiz);

      const allBiz = await businessesService.list();
      // Filter out our own business from B2B directory
      setBusinesses(allBiz.filter((b) => b.id !== myBiz.id));
    } catch (err) {
      console.error(err);
      showNotification('Error loading business directory.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchMessages = useCallback(async () => {
    try {
      const inboxList = await messagesService.getInbox();
      setInbox(inboxList);

      const sentList = await messagesService.getSent();
      setSentMessages(sentList);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchMyBusinessAndBusinesses();
        fetchMessages();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchMyBusinessAndBusinesses, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !messageContent.trim()) return;

    try {
      await messagesService.send({
        receiver_business_id: selectedBusiness.id,
        content: messageContent,
        subject: 'B2B Trade Communication',
      });
      showNotification(`Message sent to ${selectedBusiness.name}!`, 'success');
      setMessageContent('');
      setSelectedBusiness(null);
      fetchMessages();
      setActiveSubTab('sent');
    } catch {
      showNotification('Failed to send message.', 'error');
    }
  };

  const handleMarkAsRead = async (msgId: number) => {
    try {
      await messagesService.markAsRead(msgId);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOwnTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myBusiness || !newTag.trim()) return;

    try {
      const updated = await businessesService.addTag(myBusiness.id, newTag.trim());
      setMyBusiness(updated);
      setNewTag('');
      showNotification('Tag added successfully!', 'success');
    } catch {
      showNotification('Failed to add tag.', 'error');
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    if (!searchTag.trim()) return true;
    return b.tags?.toLowerCase().includes(searchTag.toLowerCase());
  });

  return (
    <div className="communications-template">
      <div className="row g-3 mb-4">
        {/* Manage Own Tags */}
        <div className="col-12">
          <div className="card p-3 bg-light border-0">
            <h6 className="fw-bold text-primary mb-2">My Business Tags (B2B Discovery)</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {myBusiness?.tags
                ? myBusiness.tags.split(',').map((t, idx) => (
                    <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle">
                      #{t.trim()}
                    </span>
                  ))
                : <span className="text-secondary small">No tags set yet. Add tags so other businesses can find you!</span>
              }
            </div>
            <form onSubmit={handleAddOwnTag} className="d-flex gap-2" style={{ maxWidth: '400px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. wholesale, bakery, spaza"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm px-3">Add Tag</button>
            </form>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn btn-outline-primary ${activeSubTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('inbox')}
          >
            <i className="bi bi-inbox me-1"></i> Inbox ({inbox.filter((m) => !m.is_read).length})
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${activeSubTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('sent')}
          >
            <i className="bi bi-send me-1"></i> Sent
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${activeSubTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('directory')}
          >
            <i className="bi bi-journal-text me-1"></i> B2B Directory
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading communications..." />}

      {!loading && activeSubTab === 'directory' && (
        <div>
          {/* Business Directory Search */}
          <div className="mb-3" style={{ maxWidth: '400px' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Filter businesses by tag (e.g. spaza)..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3">
            {filteredBusinesses.map((b) => (
              <div key={b.id} className="col-md-6 col-lg-4">
                <div className="card h-100 p-3 border">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fs-3 me-2">🏪</span>
                    <div>
                      <h6 className="fw-bold mb-0">{b.name}</h6>
                      <small className="text-secondary">{b.category}</small>
                    </div>
                  </div>
                  <p className="small text-secondary text-truncate-2-lines mb-3">
                    {b.description || 'No description available.'}
                  </p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {b.tags
                      ? b.tags.split(',').map((t, idx) => (
                          <span key={idx} className="badge bg-secondary bg-opacity-10 text-secondary" style={{ fontSize: '0.7rem' }}>
                            #{t.trim()}
                          </span>
                        ))
                      : <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>No tags</span>
                    }
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm w-100 mt-auto"
                    onClick={() => setSelectedBusiness(b)}
                  >
                    <i className="bi bi-chat-dots me-1"></i> Send B2B Message
                  </button>
                </div>
              </div>
            ))}

            {filteredBusinesses.length === 0 && (
              <div className="col-12">
                <EmptyState
                  icon="bi-journal-x"
                  title="No Businesses Found"
                  message="Try searching for another tag or register more businesses."
                />
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeSubTab === 'inbox' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Content</th>
                <th>Sent At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inbox.map((msg) => (
                <tr key={msg.id} className={!msg.is_read ? 'table-primary-subtle font-weight-bold' : ''}>
                  <td>User #{msg.sender_id}</td>
                  <td className="text-truncate" style={{ maxWidth: '300px' }}>{msg.content}</td>
                  <td>{new Date(msg.created_at).toLocaleString()}</td>
                  <td>
                    {msg.is_read
                      ? <span className="badge bg-secondary bg-opacity-10 text-secondary">Read</span>
                      : <span className="badge bg-primary bg-opacity-10 text-primary">Unread</span>
                    }
                  </td>
                  <td>
                    {!msg.is_read && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleMarkAsRead(msg.id)}
                      >
                        Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inbox.length === 0 && (
            <EmptyState
              icon="bi-envelope"
              title="Inbox Empty"
              message="You haven't received any B2B messages yet."
            />
          )}
        </div>
      )}

      {!loading && activeSubTab === 'sent' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Recipient Business</th>
                <th>Content</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {sentMessages.map((msg) => (
                <tr key={msg.id}>
                  <td>Business #{msg.receiver_business_id}</td>
                  <td className="text-truncate" style={{ maxWidth: '400px' }}>{msg.content}</td>
                  <td>{new Date(msg.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {sentMessages.length === 0 && (
            <EmptyState
              icon="bi-send-dash"
              title="No Sent Messages"
              message="Start B2B communication from the B2B Directory."
            />
          )}
        </div>
      )}

      {/* Modal for sending B2B message */}
      {selectedBusiness && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Message {selectedBusiness.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedBusiness(null)}></button>
              </div>
              <form onSubmit={handleSendMessage}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">B2B Content</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Write your trade inquiry, payment terms, or delivery arrangement details here..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedBusiness(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-send me-1"></i> Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communications;
