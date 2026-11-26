---
sidebar_position: 2
title: Instalar e atualizar
description: Instale o aplicativo para desktop do linux-cleanup como AppImage ou .deb, e veja como ele se atualiza sozinho.
---

# Instalar e atualizar

Baixe a versão atual na [página de download](https://linux-cleanup.aoneahsan.com/download); toda versão também fica no [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) com uma tag `desktop-v<version>`. Cada versão traz dois instaladores:

| Arquivo | Para |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | Qualquer distribuição com sessão de desktop. Torne-o executável e depois rode |
| `linux-cleanup_<version>_amd64.deb` | Debian, Ubuntu e derivados (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

A partir da versão 1.0.4, o AppImage se adiciona ao menu de aplicativos na primeira vez que roda: ele grava `~/.local/share/applications/linux-cleanup-desktop.desktop` e o ícone em `~/.local/share/icons/hicolor/`, e aponta o item para onde quer que o arquivo esteja. Se você mover o AppImage, rode uma vez do novo lugar e o item acompanha. O `.deb` instala o próprio item de menu.

O aplicativo para desktop precisa do WebKitGTK 4.1 e do GTK 3, que as distribuições de desktop atuais trazem. O `.deb` os declara como dependências.

## Como ele se atualiza {#how-it-updates}

O aplicativo se atualiza sozinho. Ele procura uma atualização assinada ao abrir, quando a janela volta a aparecer e no momento em que uma versão nova é publicada. Com **Instalar atualizações automaticamente** ligado (o padrão), ele baixa a atualização, confere a assinatura e reinicia num momento tranquilo: nunca durante uma execução.

Um **AppImage** é substituído no lugar. Uma instalação **`.deb`** se atualiza pelo `dpkg`, então o desktop pede antes a senha de administrador (aquela janela gráfica de sempre); cancelar mantém a versão atual rodando.

Uma versão também pode ser marcada como **obrigatória**:

- uma versão **urgente** para o aplicativo na hora, explica o motivo e oferece um único botão **Atualizar**;
- uma versão **normal** avisa que saiu uma versão nova e passa a ser obrigatória a partir da próxima abertura.

Se o aplicativo estiver offline na hora da checagem, ele segue em frente; uma checagem que falha nunca bloqueia uma execução.
