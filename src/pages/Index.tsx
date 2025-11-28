import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { AuthDialog } from '@/components/AuthDialog';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  views: number;
  comments: Comment[];
}

interface ForumSection {
  id: string;
  title: string;
  description: string;
  author: string;
  organization: string;
  posts: Post[];
  lastActivity: string;
  color: string;
}

const Index = () => {
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'section' | 'post'; id: string } | null>(null);
  
  const [selectedSection, setSelectedSection] = useState<ForumSection | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    author: '',
    organization: '',
    color: '#0EA5E9'
  });

  const [editSection, setEditSection] = useState({
    title: '',
    description: '',
    author: '',
    organization: '',
    color: '#0EA5E9'
  });

  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  const [editPost, setEditPost] = useState({
    title: '',
    content: ''
  });

  const [sections, setSections] = useState<ForumSection[]>([
    {
      id: '1',
      title: 'Новости Grove Street Families',
      description: 'Официальные объявления и новости от руководства GSF',
      author: 'CJ',
      organization: 'Grove Street Families',
      lastActivity: '2 часа назад',
      color: '#8B5CF6',
      posts: [
        {
          id: 'p1',
          title: 'Новые правила территории GSF',
          content: 'Братва! С сегодняшнего дня вводим новые правила патрулирования нашей территории. Все члены банды должны соблюдать...',
          author: 'CJ',
          timestamp: '2 часа назад',
          views: 145,
          comments: [
            {
              id: 'c1',
              author: 'Sweet',
              content: 'Четко, брат! Будем держать улицы в порядке',
              timestamp: '1 час назад',
              avatar: 'S'
            },
            {
              id: 'c2',
              author: 'Ryder',
              content: 'Yo, CJ! А когда тренировка для новичков?',
              timestamp: '30 минут назад',
              avatar: 'R'
            }
          ]
        },
        {
          id: 'p2',
          title: 'Встреча всех членов банды',
          content: 'Завтра в 20:00 собираемся у дома на Grove Street. Будем обсуждать планы на следующую неделю.',
          author: 'Sweet',
          timestamp: '5 часов назад',
          views: 89,
          comments: []
        }
      ]
    },
    {
      id: '2',
      title: 'Обновления Ballas Gang',
      description: 'Важная информация для членов банды Ballas',
      author: 'Kane',
      organization: 'Ballas Gang',
      lastActivity: '5 часов назад',
      color: '#F97316',
      posts: [
        {
          id: 'p3',
          title: 'Расширение территории',
          content: 'Захватили новый район! Всем быть начеку и защищать позиции.',
          author: 'Kane',
          timestamp: '5 часов назад',
          views: 203,
          comments: [
            {
              id: 'c3',
              author: 'Little Weasel',
              content: 'Респект босс! Будем держать оборону',
              timestamp: '4 часа назад',
              avatar: 'L'
            }
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'LSPD - Объявления департамента',
      description: 'Официальные сообщения от полицейского управления',
      author: 'Chief Tenpenny',
      organization: 'Los Santos Police',
      lastActivity: '1 час назад',
      color: '#0EA5E9',
      posts: [
        {
          id: 'p4',
          title: 'Новый график патрулирования',
          content: 'Внимание всем офицерам! Обновлен график дежурств. Проверьте расписание в отделении.',
          author: 'Chief Tenpenny',
          timestamp: '1 час назад',
          views: 167,
          comments: []
        }
      ]
    }
  ]);

  const handleLogin = (username: string, isAdmin: boolean) => {
    setUser({ name: username, isAdmin });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "До встречи на форуме!"
    });
  };

  const handleCreateSection = () => {
    if (!newSection.title || !newSection.description || !newSection.author || !newSection.organization) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const section: ForumSection = {
      id: Date.now().toString(),
      title: newSection.title,
      description: newSection.description,
      author: newSection.author,
      organization: newSection.organization,
      posts: [],
      lastActivity: 'только что',
      color: newSection.color
    };

    setSections([section, ...sections]);
    setIsCreateDialogOpen(false);
    setNewSection({
      title: '',
      description: '',
      author: '',
      organization: '',
      color: '#0EA5E9'
    });

    toast({
      title: "Раздел создан!",
      description: `Раздел "${section.title}" успешно добавлен на форум`
    });
  };

  const openEditSection = (section: ForumSection) => {
    setEditSection({
      title: section.title,
      description: section.description,
      author: section.author,
      organization: section.organization,
      color: section.color
    });
    setIsEditSectionOpen(true);
  };

  const handleUpdateSection = () => {
    if (!selectedSection || !editSection.title || !editSection.description) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const updatedSection = {
      ...selectedSection,
      title: editSection.title,
      description: editSection.description,
      author: editSection.author,
      organization: editSection.organization,
      color: editSection.color
    };

    setSections(sections.map(s => s.id === selectedSection.id ? updatedSection : s));
    setSelectedSection(updatedSection);
    setIsEditSectionOpen(false);

    toast({
      title: "Раздел обновлен!",
      description: "Изменения сохранены"
    });
  };

  const confirmDelete = (type: 'section' | 'post', id: string) => {
    setDeleteTarget({ type, id });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'section') {
      setSections(sections.filter(s => s.id !== deleteTarget.id));
      setSelectedSection(null);
      toast({
        title: "Раздел удален",
        description: "Раздел успешно удален с форума"
      });
    } else if (deleteTarget.type === 'post' && selectedSection) {
      const updatedSection = {
        ...selectedSection,
        posts: selectedSection.posts.filter(p => p.id !== deleteTarget.id)
      };
      setSections(sections.map(s => s.id === selectedSection.id ? updatedSection : s));
      setSelectedSection(updatedSection);
      setSelectedPost(null);
      toast({
        title: "Пост удален",
        description: "Пост успешно удален"
      });
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleCreatePost = () => {
    if (!selectedSection || !newPost.title || !newPost.content) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: user?.name || selectedSection.author,
      timestamp: 'только что',
      views: 0,
      comments: []
    };

    const updatedSection = {
      ...selectedSection,
      posts: [post, ...selectedSection.posts],
      lastActivity: 'только что'
    };

    setSections(sections.map(s => s.id === selectedSection.id ? updatedSection : s));
    setSelectedSection(updatedSection);
    setIsCreatePostOpen(false);
    setNewPost({ title: '', content: '' });

    toast({
      title: "Пост создан!",
      description: `Пост "${post.title}" опубликован`
    });
  };

  const openEditPost = (post: Post) => {
    setEditPost({
      title: post.title,
      content: post.content
    });
    setIsEditPostOpen(true);
  };

  const handleUpdatePost = () => {
    if (!selectedPost || !selectedSection || !editPost.title || !editPost.content) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const updatedPost = {
      ...selectedPost,
      title: editPost.title,
      content: editPost.content
    };

    const updatedSection = {
      ...selectedSection,
      posts: selectedSection.posts.map(p => p.id === selectedPost.id ? updatedPost : p)
    };

    setSections(sections.map(s => s.id === selectedSection.id ? updatedSection : s));
    setSelectedSection(updatedSection);
    setSelectedPost(updatedPost);
    setIsEditPostOpen(false);

    toast({
      title: "Пост обновлен!",
      description: "Изменения сохранены"
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost || !selectedSection || !user) {
      toast({
        title: "Ошибка",
        description: "Войдите в аккаунт, чтобы комментировать",
        variant: "destructive"
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      content: commentText,
      timestamp: 'только что',
      avatar: user.name[0].toUpperCase()
    };

    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, comment]
    };

    setSections(sections.map(s => 
      s.id === selectedSection.id 
        ? {
            ...s,
            posts: s.posts.map(p => p.id === selectedPost.id ? updatedPost : p)
          }
        : s
    ));

    setSelectedPost(updatedPost);
    setCommentText('');

    toast({
      title: "Комментарий добавлен!",
      description: "Ваш комментарий опубликован"
    });
  };

  const openSectionPosts = (section: ForumSection) => {
    setSelectedSection(section);
    setSelectedPost(null);
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
  };

  const goBackToSection = () => {
    setSelectedPost(null);
  };

  const goBackToSections = () => {
    setSelectedSection(null);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center animate-fade-in">
          <div className="flex justify-end mb-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Icon name="User" size={18} />
                    {user.name}
                    {user.isAdmin && <Badge variant="secondary" className="ml-1">Admin</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsAuthOpen(true)} variant="outline" className="gap-2">
                <Icon name="LogIn" size={18} />
                Войти
              </Button>
            )}
          </div>

          <div className="inline-block mb-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              BLACK FLORIDA
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-glow"></div>
          </div>
          <p className="text-muted-foreground text-lg">Форум игрового сервера</p>
        </header>

        {!selectedSection ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Icon name="MessageSquare" className="text-primary" size={32} />
                <h2 className="text-3xl font-bold">Разделы организаций</h2>
              </div>
              
              {user?.isAdmin && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Создать раздел
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] border-border bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Новый раздел форума</DialogTitle>
                      <DialogDescription>
                        Создайте раздел для информирования игроков от имени организации
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Название раздела</Label>
                        <Input
                          id="title"
                          placeholder="Новости Grove Street Families"
                          value={newSection.title}
                          onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                          className="bg-muted border-border"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                          id="description"
                          placeholder="Официальные объявления и новости..."
                          value={newSection.description}
                          onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                          className="bg-muted border-border min-h-[100px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="author">Лидер</Label>
                          <Input
                            id="author"
                            placeholder="CJ"
                            value={newSection.author}
                            onChange={(e) => setNewSection({...newSection, author: e.target.value})}
                            className="bg-muted border-border"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="organization">Организация</Label>
                          <Input
                            id="organization"
                            placeholder="Grove Street Families"
                            value={newSection.organization}
                            onChange={(e) => setNewSection({...newSection, organization: e.target.value})}
                            className="bg-muted border-border"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="color">Цвет акцента</Label>
                        <div className="flex gap-2">
                          {['#0EA5E9', '#8B5CF6', '#F97316', '#10B981', '#EF4444'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewSection({...newSection, color})}
                              className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                newSection.color === color ? 'ring-2 ring-offset-2 ring-offset-card ring-primary scale-110' : 'hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleCreateSection} className="bg-gradient-to-r from-primary to-secondary">
                        Создать
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-6 animate-fade-in">
              {sections.map((section, index) => (
                <Card 
                  key={section.id}
                  className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-border bg-card/50 backdrop-blur-sm overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    borderLeft: `4px solid ${section.color}`
                  }}
                >
                  <CardHeader className="cursor-pointer" onClick={() => openSectionPosts(section)}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {section.title}
                          </CardTitle>
                          <div 
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: section.color }}
                          />
                        </div>
                        <CardDescription className="text-base">{section.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="text-sm px-3 py-1"
                          style={{ 
                            backgroundColor: `${section.color}20`,
                            color: section.color,
                            borderColor: section.color
                          }}
                        >
                          <Icon name="Users" size={14} className="mr-1" />
                          {section.organization}
                        </Badge>
                        {user?.isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Icon name="MoreVertical" size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSection(section);
                                openEditSection(section);
                              }}>
                                <Icon name="Edit" size={16} className="mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete('section', section.id);
                                }}
                                className="text-destructive"
                              >
                                <Icon name="Trash2" size={16} className="mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="cursor-pointer" onClick={() => openSectionPosts(section)}>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} className="text-primary" />
                          <span className="font-medium">{section.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="FileText" size={16} className="text-secondary" />
                          <span>{section.posts.length} постов</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-accent" />
                        <span>{section.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : !selectedPost ? (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <Button variant="ghost" onClick={goBackToSections} className="gap-2">
                <Icon name="ArrowLeft" size={20} />
                Назад к разделам
              </Button>
              {user?.isAdmin && (
                <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Создать пост
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] border-border bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Новый пост</DialogTitle>
                      <DialogDescription>
                        Создайте новый пост в разделе {selectedSection.title}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="post-title">Заголовок</Label>
                        <Input
                          id="post-title"
                          placeholder="Важное объявление"
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="bg-muted border-border"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="post-content">Содержание</Label>
                        <Textarea
                          id="post-content"
                          placeholder="Текст вашего объявления..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className="bg-muted border-border min-h-[200px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-gradient-to-r from-primary to-secondary">
                        Опубликовать
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: selectedSection.color }}
                />
                <div>
                  <h2 className="text-4xl font-bold">{selectedSection.title}</h2>
                  <p className="text-muted-foreground">{selectedSection.organization}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {selectedSection.posts.length === 0 ? (
                <Card className="p-12 text-center border-border bg-card/50">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">Пока нет постов в этом разделе</p>
                </Card>
              ) : (
                selectedSection.posts.map((post) => (
                  <Card 
                    key={post.id}
                    className="transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-border bg-card/50"
                  >
                    <CardHeader className="cursor-pointer" onClick={() => openPost(post)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <CardDescription className="text-base line-clamp-2">{post.content}</CardDescription>
                        </div>
                        {user?.isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Icon name="MoreVertical" size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPost(post);
                                openEditPost(post);
                              }}>
                                <Icon name="Edit" size={16} className="mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete('post', post.id);
                                }}
                                className="text-destructive"
                              >
                                <Icon name="Trash2" size={16} className="mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="cursor-pointer" onClick={() => openPost(post)}>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Icon name="User" size={16} style={{ color: selectedSection.color }} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="MessageCircle" size={16} style={{ color: selectedSection.color }} />
                            <span>{post.comments.length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Eye" size={16} style={{ color: selectedSection.color }} />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        <span>{post.timestamp}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Button variant="ghost" onClick={goBackToSection} className="gap-2">
                <Icon name="ArrowLeft" size={20} />
                Назад к постам
              </Button>
            </div>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                    style={{ backgroundColor: selectedSection.color }}
                  >
                    {selectedPost.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-lg">{selectedPost.author}</span>
                      <Badge variant="outline">Лидер</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{selectedPost.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" size={14} />
                        <span>{selectedPost.views} просмотров</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl mb-4">{selectedPost.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-8 whitespace-pre-wrap">{selectedPost.content}</p>
                
                <Separator className="my-8" />
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="MessageCircle" size={24} style={{ color: selectedSection.color }} />
                    Комментарии ({selectedPost.comments.length})
                  </h3>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <Textarea
                      placeholder={user ? "Напишите комментарий..." : "Войдите, чтобы комментировать"}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-3 bg-background border-border"
                      rows={3}
                      disabled={!user}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || !user}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {selectedPost.comments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Пока нет комментариев</p>
                      ) : (
                        selectedPost.comments.map((comment) => (
                          <div key={comment.id} className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                style={{ backgroundColor: selectedSection.color }}
                              >
                                {comment.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                                <p className="text-foreground">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <AuthDialog 
          open={isAuthOpen} 
          onOpenChange={setIsAuthOpen} 
          onLogin={handleLogin}
        />

        <Dialog open={isEditSectionOpen} onOpenChange={setIsEditSectionOpen}>
          <DialogContent className="sm:max-w-[500px] border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl">Редактировать раздел</DialogTitle>
              <DialogDescription>
                Внесите изменения в раздел форума
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Название раздела</Label>
                <Input
                  id="edit-title"
                  value={editSection.title}
                  onChange={(e) => setEditSection({...editSection, title: e.target.value})}
                  className="bg-muted border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  value={editSection.description}
                  onChange={(e) => setEditSection({...editSection, description: e.target.value})}
                  className="bg-muted border-border min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-author">Лидер</Label>
                  <Input
                    id="edit-author"
                    value={editSection.author}
                    onChange={(e) => setEditSection({...editSection, author: e.target.value})}
                    className="bg-muted border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-organization">Организация</Label>
                  <Input
                    id="edit-organization"
                    value={editSection.organization}
                    onChange={(e) => setEditSection({...editSection, organization: e.target.value})}
                    className="bg-muted border-border"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-color">Цвет акцента</Label>
                <div className="flex gap-2">
                  {['#0EA5E9', '#8B5CF6', '#F97316', '#10B981', '#EF4444'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditSection({...editSection, color})}
                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                        editSection.color === color ? 'ring-2 ring-offset-2 ring-offset-card ring-primary scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSectionOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateSection} className="bg-gradient-to-r from-primary to-secondary">
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
          <DialogContent className="sm:max-w-[600px] border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl">Редактировать пост</DialogTitle>
              <DialogDescription>
                Внесите изменения в пост
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-post-title">Заголовок</Label>
                <Input
                  id="edit-post-title"
                  value={editPost.title}
                  onChange={(e) => setEditPost({...editPost, title: e.target.value})}
                  className="bg-muted border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-post-content">Содержание</Label>
                <Textarea
                  id="edit-post-content"
                  value={editPost.content}
                  onChange={(e) => setEditPost({...editPost, content: e.target.value})}
                  className="bg-muted border-border min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPostOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdatePost} className="bg-gradient-to-r from-primary to-secondary">
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.type === 'section' 
                  ? 'Вы уверены, что хотите удалить этот раздел? Все посты в нем будут удалены.'
                  : 'Вы уверены, что хотите удалить этот пост? Все комментарии будут удалены.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
