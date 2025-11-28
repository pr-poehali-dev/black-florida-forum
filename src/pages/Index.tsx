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
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

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
  const [isAdmin] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
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

  const [newPost, setNewPost] = useState({
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
      author: selectedSection.author,
      timestamp: 'только что',
      views: 0,
      comments: []
    };

    setSections(sections.map(s => 
      s.id === selectedSection.id 
        ? { ...s, posts: [post, ...s.posts], lastActivity: 'только что' }
        : s
    ));

    setSelectedSection({
      ...selectedSection,
      posts: [post, ...selectedSection.posts],
      lastActivity: 'только что'
    });

    setIsCreatePostOpen(false);
    setNewPost({ title: '', content: '' });

    toast({
      title: "Пост создан!",
      description: `Пост "${post.title}" опубликован`
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost || !selectedSection) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Игрок',
      content: commentText,
      timestamp: 'только что',
      avatar: 'И'
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
              
              {isAdmin && (
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
                  className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-border bg-card/50 backdrop-blur-sm overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    borderLeft: `4px solid ${section.color}`
                  }}
                  onClick={() => openSectionPosts(section)}
                >
                  <CardHeader>
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
                    </div>
                  </CardHeader>
                  <CardContent>
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
              {isAdmin && (
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
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-border bg-card/50"
                    onClick={() => openPost(post)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription className="text-base line-clamp-2">{post.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                      placeholder="Напишите комментарий..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-3 bg-background border-border"
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
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
      </div>
    </div>
  );
};

export default Index;
