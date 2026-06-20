'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Camera,
  Clock3,
  FileText,
  Image,
  LayoutGrid,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from 'lucide-react';

type Comment = {
  author: string;
  text: string;
  time: string;
};

type Post = {
  id: string;
  author: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  shares: number;
};

const navItems = [
  { id: 'feed', label: 'Feed', icon: LayoutGrid },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: Users },
  { id: 'ai', label: 'AI', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const initialPosts: Post[] = [
  {
    id: 'post-1',
    author: 'Sofia Nguyen',
    handle: '@sofia',
    time: '2h',
    text: 'Bringing AI into team workflows with a clean mobile-first experience. #SofAiHub',
    likes: 28,
    liked: false,
    comments: [
      { author: 'Aisha', text: 'Love the direction!', time: '2h' },
      { author: 'Lena', text: 'Can we add analytics to the dashboard?', time: '1h' },
    ],
    shares: 4,
  },
  {
    id: 'post-2',
    author: 'Aiden Chow',
    handle: '@aiden',
    time: '5h',
    text: 'Created a new group voice room for product standup. Join if you want!',
    likes: 13,
    liked: false,
    comments: [
      { author: 'Maya', text: 'I’m in!', time: '4h' },
    ],
    shares: 2,
  },
];

const initialChats = [
  {
    id: 'chat-1',
    name: 'Aisha Patel',
    lastMessage: 'I updated the post layout; check it out.',
    time: '2:18 PM',
    unread: 2,
    messages: [
      { sender: 'other', text: 'Can you review the post draft?', time: '2:11 PM' },
      { sender: 'me', text: 'Looks great. I’d tighten the card spacing.', time: '2:12 PM' },
      { sender: 'other', text: 'Good call—doing it now.', time: '2:14 PM' },
    ],
  },
  {
    id: 'chat-2',
    name: 'Team Marketing',
    lastMessage: 'Shared the campaign deck.',
    time: '1:04 PM',
    unread: 0,
    messages: [
      { sender: 'other', text: 'Draft ready for review.', time: '12:50 PM' },
      { sender: 'me', text: 'Reviewing now.', time: '12:55 PM' },
    ],
  },
];

const securityItems = [
  'Two-factor authentication (2FA)',
  'Device management',
  'Active sessions',
  'Login alerts',
  'Suspicious login detection',
  'Email and phone verification',
];

export default function Home() {
  const [user, setUser] = useState<{ name: string; username: string; email: string; avatar?: string; bio: string } | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');
  const [activePage, setActivePage] = useState<'feed' | 'messages' | 'profile' | 'ai' | 'settings'>('feed');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState('chat-1');
  const [messageDraft, setMessageDraft] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('Summarize the latest community discussion.');
  const [aiResponse, setAiResponse] = useState('Ask the AI assistant a question to see results here.');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedChat = useMemo(() => chats.find((chat) => chat.id === selectedChatId) || chats[0], [chats, selectedChatId]);

  const handleAuthSubmit = () => {
    if (!form.email || !form.password) return;
    setUser({ name: form.name || 'New User', username: form.username || 'newuser', email: form.email, avatar: avatarPreview, bio: '' });
    setActivePage('feed');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setPosts([
      {
        id: `post-${Date.now()}`,
        author: user?.name || 'You',
        handle: `@${user?.username || 'you'}`,
        time: 'Just now',
        text: newPost.trim(),
        likes: 0,
        liked: false,
        comments: [],
        shares: 0,
      },
      ...posts,
    ]);
    setNewPost('');
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim() || !selectedChat) return;
    const updatedChats = chats.map((chat) =>
      chat.id === selectedChat.id
        ? { ...chat, lastMessage: messageDraft, time: 'Now', unread: 0, messages: [...chat.messages, { sender: 'me', text: messageDraft.trim(), time: 'Now' }] }
        : chat,
    );
    setChats(updatedChats);
    setMessageDraft('');
  };

  const handleToggleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? Math.max(post.likes - 1, 0) : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleCommentDraftChange = (postId: string, value: string) => {
    setCommentDrafts((current) => ({ ...current, [postId]: value }));
  };

  const handleAddComment = (postId: string) => {
    const comment = commentDrafts[postId]?.trim();
    if (!comment) return;
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { author: user?.name || 'You', text: comment, time: 'Now' }],
            }
          : post,
      ),
    );
    setCommentDrafts((current) => ({ ...current, [postId]: '' }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    if (user) {
      setUser({ ...user, avatar: url });
    }
  };

  const handleQueryAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await response.json();
      setAiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setAiResponse('AI request failed.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-[#111827]">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-soft sm:p-10">
            <div className="mb-8 flex flex-col gap-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">SofAi Hub</p>
              <h1 className="text-3xl font-semibold text-[#111827] sm:text-4xl">Get started with a real AI-powered platform.</h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-[#4B5563] sm:text-base">
                Create an account, upload your profile picture, and access feed, messaging, stories, and AI features from one integrated experience.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#111827]">{authView === 'register' ? 'Create Account' : 'Login'}</h2>
                  <button className="text-sm font-semibold text-[#16A34A]" onClick={() => setAuthView(authView === 'register' ? 'login' : 'register')}>
                    {authView === 'register' ? 'Switch to login' : 'Create account'}
                  </button>
                </div>
                <div className="space-y-4">
                  {authView === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Profile picture</label>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="mt-2 block w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]" />
                      {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="mt-3 h-20 w-20 rounded-full object-cover" />}
                    </div>
                  )}
                  {authView === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Name</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 block w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]" placeholder="Your name" />
                    </div>
                  )}
                  {authView === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Username</label>
                      <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-2 block w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]" placeholder="yourusername" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#111827]">Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 block w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827]">Password</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 block w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]" placeholder="Create a strong password" />
                  </div>
                  <button onClick={handleAuthSubmit} className="inline-flex w-full items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                    {authView === 'register' ? 'Create account' : 'Login'}
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#047857]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827]">What you get</p>
                    <p className="mt-1 text-sm text-[#4B5563]">A unified platform with feed, messaging, stories, and AI assistant integration.</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-[#4B5563]">
                  <li className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3">Profile creation with avatar and bio</li>
                  <li className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3">Real-time direct messages and group chat flow</li>
                  <li className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3">AI-powered suggestions and summaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#111827] dark:bg-[#0f172a] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-6">
        <header className="sticky top-0 z-40 rounded-[32px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-soft sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile avatar" className="h-11 w-11 rounded-full object-cover" />
              ) : null}
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">SofAi Hub</p>
            </div>
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile avatar" className="h-11 w-11 rounded-full object-cover" />
              ) : null}
            </div>
          </div>
        </header>

        <div className={`grid flex-1 gap-6 xl:grid-cols-[280px_1fr] ${theme === 'dark' ? 'bg-[#111827] text-white' : ''}`}>
          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#DCFCE7] text-2xl font-semibold text-[#047857]">{user.name.charAt(0)}</div>
                <div>
                  <p className="text-lg font-semibold text-[#111827]">{user.name}</p>
                  <p className="text-sm text-[#6B7280]">{user.email}</p>
                </div>
              </div>
              <div className="mt-6 hidden gap-3 lg:grid">
                <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4">
                  <p className="text-sm font-semibold text-[#111827]">Followers</p>
                  <p className="mt-2 text-2xl font-semibold text-[#111827]">1.2K</p>
                </div>
                <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4">
                  <p className="text-sm font-semibold text-[#111827]">Following</p>
                  <p className="mt-2 text-2xl font-semibold text-[#111827]">340</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block rounded-[32px] border border-[#E5E7EB] bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-[#111827]">Navigation</p>
              <div className="mt-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id as any);
                      if (item.id !== 'messages') setIsChatOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${
                      activePage === item.id ? 'bg-[#ECFDF5] text-[#047857]' : 'text-[#4B5563] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden rounded-[32px] border border-[#E5E7EB] bg-white p-5 shadow-soft lg:block">
              <p className="text-sm font-semibold text-[#111827]">Quick actions</p>
              <div className="mt-4 space-y-3 text-sm text-[#4B5563]">
                <button className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-left">Post status</button>
                <button className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-left">Start voice room</button>
                <button className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-left">Open AI assistant</button>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            {activePage === 'feed' && (
              <div className="space-y-6">
                <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Feed</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#111827]">Post a new update</h2>
                    </div>
                    <button onClick={handleAddPost} className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                      <Send className="mr-2 h-4 w-4" />
                      Post status
                    </button>
                  </div>
                  <div className="mt-5 space-y-4">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                      className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0"
                      placeholder="Share something with your followers..."
                    />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#4B5563]">
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] transition hover:bg-[#F8FAFC]"><Image className="h-4 w-4" /> Image</button>
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] transition hover:bg-[#F8FAFC]"><Video className="h-4 w-4" /> Video</button>
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] transition hover:bg-[#F8FAFC]"><Paperclip className="h-4 w-4" /> File</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {posts.map((post) => (
                    <article key={post.id} className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#DCFCE7] text-lg font-semibold text-[#047857]">{post.author.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#111827]">{post.author}</p>
                              <p className="text-xs text-[#6B7280]">{post.handle} · {post.time}</p>
                            </div>
                            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#4B5563]">Feed</span>
                          </div>
                          <p className="mt-4 text-sm leading-7 text-[#4B5563]">{post.text}</p>
                          <div className="mt-5 flex flex-wrap gap-3 text-sm">
                            <button
                              onClick={() => handleToggleLike(post.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${post.liked ? 'bg-[#DCFCE7] text-[#047857]' : 'text-[#4B5563] hover:bg-[#F3F4F6]'}`}
                            >
                              <Star className="h-4 w-4" /> {post.likes} {post.liked ? 'Liked' : 'Like'}
                            </button>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-2 text-[#4B5563]">
                              <MessageSquare className="h-4 w-4" /> {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-2 text-[#4B5563]">
                              <Share2 className="h-4 w-4" /> {post.shares} Share{post.shares !== 1 ? 's' : ''}
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-2 text-[#4B5563] hover:bg-[#E5E7EB]">
                              <Bookmark className="h-4 w-4" /> Save
                            </button>
                          </div>

                          {post.comments.length > 0 && (
                            <div className="mt-5 space-y-3 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                              {post.comments.slice(-3).map((comment, index) => (
                                <div key={index} className="rounded-3xl bg-white p-4 text-sm text-[#111827]">
                                  <p className="font-semibold text-[#111827]">{comment.author}</p>
                                  <p className="mt-1 text-[#4B5563]">{comment.text}</p>
                                  <p className="mt-2 text-xs text-[#6B7280]">{comment.time}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                              value={commentDrafts[post.id] || ''}
                              onChange={(e) => handleCommentDraftChange(post.id, e.target.value)}
                              className="flex-1 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0"
                              placeholder="Write a comment..."
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activePage === 'messages' && (
              <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
                <aside className={`rounded-[32px] border border-[#E5E7EB] bg-white p-5 shadow-soft ${isChatOpen ? 'hidden xl:block' : 'block'}`}>
                  <div className="mb-4 flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">Messages</p>
                      <p className="text-xs text-[#6B7280]">Tap a contact to open chat</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                      <Search className="h-4 w-4 text-[#6B7280]" />
                      <input
                        type="text"
                        placeholder="Search contacts"
                        className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {chats.map((chat) => (
                      <button key={chat.id} onClick={() => { setSelectedChatId(chat.id); setIsChatOpen(true); }} className={`w-full rounded-3xl px-4 py-4 text-left transition ${selectedChat?.id === chat.id ? 'bg-[#ECFDF5]' : 'hover:bg-[#F8FAFC]'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#111827]">{chat.name}</p>
                            <p className="mt-1 truncate text-sm text-[#6B7280]">{chat.lastMessage}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[11px] text-[#6B7280]">{chat.time}</span>
                            {chat.unread > 0 && (
                              <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#16A34A] px-2 text-[11px] font-semibold text-white">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>
                <section className={`rounded-[32px] border border-[#E5E7EB] bg-white p-5 shadow-soft ${isChatOpen ? 'block' : 'hidden'} xl:block`}>
                  <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                    <button type="button" onClick={() => setIsChatOpen(false)} className="inline-flex items-center gap-2 text-sm text-[#4B5563] xl:hidden">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div>
                      <p className="text-lg font-semibold text-[#111827]">{selectedChat?.name}</p>
                      <p className="text-sm text-[#6B7280]">Typing indicator, voice notes, file sharing</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#6B7280]">
                      <Video className="h-5 w-5" />
                      <Clock3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-4 overflow-y-auto pr-2">
                    {selectedChat?.messages.map((message, idx) => (
                      <div key={idx} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-3xl px-4 py-3 text-sm leading-6 ${message.sender === 'me' ? 'bg-[#DCFCE7] text-[#0F172A]' : 'bg-[#F3F4F6] text-[#111827]'}`}>
                          <p>{message.text}</p>
                          <p className="mt-2 text-[11px] text-[#6B7280] text-right">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={messageDraft}
                        onChange={(e) => setMessageDraft(e.target.value)}
                        className="flex-1 rounded-3xl border border-transparent bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0"
                        placeholder="Type a message..."
                      />
                      <button onClick={handleSendMessage} className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                        Send
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#4B5563]">
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2"> <Paperclip className="h-4 w-4" /> Attach</button>
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2"> <Image className="h-4 w-4" /> Photo</button>
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2"> <Video className="h-4 w-4" /> Video</button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activePage === 'profile' && (
              <div className="space-y-6">
                <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#DCFCE7] text-3xl font-semibold text-[#047857]">{user.name.charAt(0)}</div>
                      <div>
                        <p className="text-2xl font-semibold text-[#111827]">{user.name}</p>
                        <p className="text-sm text-[#6B7280]">{user.username} · {user.email}</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">Edit profile</button>
                  </div>
                  <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {['Verified badge', 'Creator badge', 'Business badge'].map((badge) => (
                      <div key={badge} className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4 text-sm text-[#4B5563]">{badge}</div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Profile</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#111827]">Your account and social stats</h2>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#111827]">View followers</button>
                  </div>
                  <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-5 text-center">
                      <p className="text-3xl font-semibold text-[#111827]">4.8K</p>
                      <p className="mt-1 text-sm text-[#6B7280]">Followers</p>
                    </div>
                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-5 text-center">
                      <p className="text-3xl font-semibold text-[#111827]">598</p>
                      <p className="mt-1 text-sm text-[#6B7280]">Following</p>
                    </div>
                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-5 text-center">
                      <p className="text-3xl font-semibold text-[#111827]">12</p>
                      <p className="mt-1 text-sm text-[#6B7280]">Posts</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activePage === 'ai' && (
              <div className="space-y-6">
                <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">AI Assistant</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#111827]">Ask Groq for help</h2>
                    </div>
                    <button onClick={handleQueryAi} className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                      {isAiLoading ? 'Processing…' : 'Run AI'}
                    </button>
                  </div>
                  <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} rows={4} className="mt-4 w-full rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0" />
                  <div className="mt-4 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm text-[#111827]">
                    <pre className="whitespace-pre-wrap">{aiResponse}</pre>
                  </div>
                </section>
              </div>
            )}

            {activePage === 'settings' && (
              <div className="space-y-6">
                <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Settings</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#111827] dark:text-white">Manage your profile</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">Enable 2FA</button>
                      <button onClick={handleToggleTheme} className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${theme === 'dark' ? 'bg-white text-[#111827] hover:bg-slate-200' : 'bg-[#111827] text-white hover:bg-[#374151]'}`}>
                        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-sm font-semibold text-[#111827] dark:text-white">Profile picture</p>
                      <div className="mt-4 flex items-center gap-4">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Profile avatar" className="h-20 w-20 rounded-3xl object-cover" />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#DCFCE7] text-3xl font-semibold text-[#047857]">{user.name.charAt(0)}</div>
                        )}
                        <div>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#F8FAFC]">
                            <Camera className="h-4 w-4 text-[#16A34A]" />
                            Change photo
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-sm font-semibold text-[#111827] dark:text-white">Security overview</p>
                      <ul className="mt-4 space-y-3 text-sm text-[#4B5563]">
                        {securityItems.map((item) => (
                          <li key={item} className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Name</label>
                      <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Username</label>
                      <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Email</label>
                      <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827]">Bio</label>
                      <textarea
                        value={user.bio}
                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        className="mt-2 h-28 w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#D1D5DB] focus:ring-0"
                        placeholder="Add a short bio..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button onClick={() => setActivePage('profile')} className="inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]">
                      Cancel
                    </button>
                    <button onClick={() => setActivePage('profile')} className="inline-flex items-center justify-center rounded-full bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                      Save profile
                    </button>
                  </div>
                </section>
              </div>
            )}
          </section>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white px-4 py-3 shadow-soft lg:hidden">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as any)}
                className={`flex flex-1 flex-col items-center justify-center rounded-3xl px-3 py-3 text-xs font-semibold transition ${
                  activePage === item.id ? 'bg-[#ECFDF5] text-[#047857]' : 'text-[#6B7280] hover:bg-[#F8FAFC]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}
