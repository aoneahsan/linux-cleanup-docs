---
title: 白标与授权
description: 以您自己的品牌运行 linux-cleanup：托管的白标许可、整体买断、更新续期以及许可验证。
---

# 白标与授权

**白标许可**让 linux-cleanup 以您的产品名称、标志和配色出现在您的用户面前。我们负责构建和签名，发布到您的发布渠道或网站，并持续更新。命令行按 MIT 许可证开源；桌面应用及其后端归我们所有，除非您买断整个产品，否则保持私有。

这里不重复列出价格。[白标价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/pricing)每次打开时都会向我们的授权服务查询价格，所以显示的始终是当前数字。

## 两种方式 {#two-ways-to-have-it}

| | 许可 | 买断 |
|---|---|---|
| 您得到什么 | 以您的名义发布、由我们运营的构建版本 | 交付给您的桌面应用源码和后端 |
| 源代码 | 不包含 | 构建桌面应用的全部仓库 |
| 独占 | 否：我们也可以授权给其他人 | 是：我们停止销售 linux-cleanup |
| 更新 | 包含六个月，之后续期 | 我们提供六个月，之后由您维护 |
| 持续费用 | 需要更新时续期 | 产品总收入的 7% 分成 |

## 各部分包含什么 {#what-each-part-delivers}

| 部分 | 在许可下 |
|---|---|
| 桌面应用 | 以您名义发布的 AppImage 和 .deb，已签名，发布到您的发布渠道，并能自动更新 |
| 命令行 | 以您名义发布的命令行工具，发布到您选择的地方（例如您自己的 npm scope） |

## 如何开始 {#how-it-starts}

1. 在[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/pricing)选择所需部分，或打开[买断页面](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/buyout)。
2. 继续前往付款页面。页面上有我们的 Wise 收款信息；请在那里完成转账并填写转账参考号。
3. 我们确认收到转账后，会签发许可或买断，并通过邮件发给您。
4. 把您的产品名称、标志、配色以及域名或发布渠道发给我们。我们负责构建、签名、发布，并在每一步通过邮件告知您。

需要产品目前还做不到的功能？[描述您的需求](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/custom-work)，我们会回复书面报价。

## 更新与续期 {#updates-and-renewals}

每个许可从确认付款之日起包含六个月的更新：以您的名义重新构建的新版本，以及针对发行版和软件包管理器变化的修复。之后，您的构建版本会继续以最后收到的版本运行。可以在[更新页面](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/updates)用许可密钥和许可上的邮箱续期 3、6 或 12 个月。

## 验证许可 {#verify-a-licence}

每个许可都有一个公开的密钥。任何人都可以在[验证许可](https://linux-cleanup.aoneahsan.com/zh-Hans/verify-license)页面检查它，或检查某个构建所运行的域名。获得许可的构建会在自己的域名上发布 `/.well-known/linuxcleanup-white-label-license.json` 许可文件。

## 常见问题 {#questions}

**我可以自己构建命令行吗？** 可以。它采用 MIT 许可证。当您希望由我们以您的名义构建、签名、发布和更新时，才需要许可。

**许可包含桌面应用的源码吗？** 不包含。只有买断才会交付源码。

完整协议以通俗的语言写在[许可条款页面](https://linux-cleanup.aoneahsan.com/zh-Hans/white-label/license-terms)上。
