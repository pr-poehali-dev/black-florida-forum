import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (username: string, isAdmin: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange, onLogin }: AuthDialogProps) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '',
    password: '', 
    confirmPassword: '' 
  });

  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const isAdmin = loginData.username.toLowerCase() === 'admin';
    
    onLogin(loginData.username, isAdmin);
    onOpenChange(false);
    setLoginData({ username: '', password: '' });
    
    toast({
      title: "Добро пожаловать!",
      description: `Вы вошли как ${loginData.username}${isAdmin ? ' (Администратор)' : ''}`
    });
  };

  const handleRegister = () => {
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть не менее 6 символов",
        variant: "destructive"
      });
      return;
    }

    onLogin(registerData.username, false);
    onOpenChange(false);
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    
    toast({
      title: "Регистрация успешна!",
      description: `Добро пожаловать, ${registerData.username}!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="UserCircle" size={28} className="text-primary" />
            Авторизация
          </DialogTitle>
          <DialogDescription>
            Войдите или зарегистрируйтесь для участия в форуме
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="login-username">Имя пользователя</Label>
              <Input
                id="login-username"
                placeholder="Введите имя"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="bg-muted border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Введите пароль"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="bg-muted border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Icon name="Info" size={14} className="inline mr-1" />
              Подсказка: используйте логин "admin" для прав администратора
            </div>
            <DialogFooter>
              <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-primary to-secondary">
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="register-username">Имя пользователя</Label>
              <Input
                id="register-username"
                placeholder="Выберите имя"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                className="bg-muted border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className="bg-muted border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">Пароль</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Минимум 6 символов"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="bg-muted border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-confirm">Подтвердите пароль</Label>
              <Input
                id="register-confirm"
                type="password"
                placeholder="Повторите пароль"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                className="bg-muted border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleRegister} className="w-full bg-gradient-to-r from-secondary to-accent">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Зарегистрироваться
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
