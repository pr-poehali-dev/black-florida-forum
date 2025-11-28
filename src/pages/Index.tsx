import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface ForumSection {
  id: string;
  title: string;
  description: string;
  author: string;
  organization: string;
  posts: number;
  lastActivity: string;
  color: string;
}

const Index = () => {
  const [isAdmin] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ForumSection | null>(null);
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    author: '',
    organization: '',
    color: '#0EA5E9'
  });

  const [sections, setSections] = useState<ForumSection[]>([
    {
      id: '1',
      title: 'Новости Grove Street Families',
      description: 'Официальные объявления и новости от руководства GSF',
      author: 'CJ',
      organization: 'Grove Street Families',
      posts: 24,
      lastActivity: '2 часа назад',
      color: '#8B5CF6'
    },
    {
      id: '2',
      title: 'Обновления Ballas Gang',
      description: 'Важная информация для членов банды Ballas',
      author: 'Kane',
      organization: 'Ballas Gang',
      posts: 18,
      lastActivity: '5 часов назад',
      color: '#F97316'
    },
    {
      id: '3',
      title: 'LSPD - Объявления департамента',
      description: 'Официальные сообщения от полицейского управления',
      author: 'Chief Tenpenny',
      organization: 'Los Santos Police',
      posts: 31,
      lastActivity: '1 час назад',
      color: '#0EA5E9'
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
      posts: 0,
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
              onClick={() => setSelectedSection(section)}
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
                      <Icon name="MessageCircle" size={16} className="text-secondary" />
                      <span>{section.posts} постов</span>
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

        <Dialog open={!!selectedSection} onOpenChange={() => setSelectedSection(null)}>
          <DialogContent className="sm:max-w-[700px] border-border bg-card">
            {selectedSection && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: selectedSection.color }}
                    />
                    <div>
                      <DialogTitle className="text-3xl mb-2">{selectedSection.title}</DialogTitle>
                      <DialogDescription className="text-base">
                        {selectedSection.organization} • {selectedSection.author}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="py-6">
                  <div className="bg-muted/50 rounded-lg p-6 border border-border">
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: selectedSection.color }}
                      >
                        {selectedSection.author[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{selectedSection.author}</span>
                          <Badge variant="outline" className="text-xs">Лидер</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedSection.lastActivity}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedSection.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="MessageCircle" size={18} style={{ color: selectedSection.color }} />
                          <span>{selectedSection.posts} постов</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Eye" size={18} style={{ color: selectedSection.color }} />
                          <span>156 просмотров</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
