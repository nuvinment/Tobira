<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Illuminate\Database\Seeder;

class DeckCardSeeder extends Seeder
{
    public function run(): void
    {
        // Decks are owned by an admin. Use the first admin found, or fall
        // back to the first user in the table if no admin role exists yet.
        $owner = User::role('admin')->first() ?? User::first();

        if (! $owner) {
            $this->command?->warn('No users found — create a user first, then re-run this seeder.');
            return;
        }

        $decks = [
            [
                'title' => 'Job Interview Essentials',
                'scenario_tag' => 'Job Interview',
                'jlpt_level' => 'N3',
                'description' => 'Core vocabulary and set phrases for Japanese job interviews.',
                'cards' => [
                    ['自己紹介', 'Self-introduction', 'じこしょうかい', 'Teineigo', '面接ではまず自己紹介をお願いします。'],
                    ['志望動機', 'Reason for applying', 'しぼうどうき', 'Teineigo', '志望動機を教えていただけますか。'],
                    ['御社', 'Your company (formal, spoken)', 'おんしゃ', 'Sonkeigo', '御社の企業理念に強く共感いたしました。'],
                    ['弊社', 'Our company (humble)', 'へいしゃ', 'Kenjougo', '弊社ではチームワークを大切にしております。'],
                    ['長所と短所', 'Strengths and weaknesses', 'ちょうしょとたんしょ', 'Teineigo', 'あなたの長所と短所を教えてください。'],
                    ['よろしくお願いいたします', 'Thank you / please treat me well', 'よろしくおねがいいたします', 'Teineigo', '本日はお忙しい中、よろしくお願いいたします。'],
                ],
            ],
            [
                'title' => 'Client Meeting Phrases',
                'scenario_tag' => 'Client Meetings',
                'jlpt_level' => 'N2',
                'description' => 'Polite expressions for meeting with clients and business partners.',
                'cards' => [
                    ['お世話になっております', 'Thank you for your continued support', 'おせわになっております', 'Teineigo', 'いつもお世話になっております。本日はお時間をいただきありがとうございます。'],
                    ['ご足労いただき', 'Thank you for taking the trouble to come', 'ごそくろういただき', 'Sonkeigo', '本日はご足労いただき、誠にありがとうございます。'],
                    ['お手数をおかけします', 'Sorry for the trouble / inconvenience', 'おてすうをおかけします', 'Teineigo', 'お手数をおかけしますが、ご確認をお願いいたします。'],
                    ['ご検討いただけますでしょうか', 'Could you please consider it', 'ごけんとういただけますでしょうか', 'Sonkeigo', 'こちらの提案について、ご検討いただけますでしょうか。'],
                    ['承知いたしました', 'Understood (humble)', 'しょうちいたしました', 'Kenjougo', 'かしこまりました。承知いたしました、すぐに対応いたします。'],
                    ['本日はありがとうございました', 'Thank you for today', 'ほんじつはありがとうございました', 'Teineigo', '本日はお忙しい中、ありがとうございました。'],
                ],
            ],
            [
                'title' => 'Business Email Etiquette',
                'scenario_tag' => 'Email Etiquette',
                'jlpt_level' => 'N3',
                'description' => 'Standard openings, closings, and polite requests for business emails.',
                'cards' => [
                    ['拝啓', 'Formal opening greeting (letters)', 'はいけい', 'Teineigo', '拝啓　貴社ますますご清栄のこととお慶び申し上げます。'],
                    ['お忙しいところ恐縮ですが', 'Sorry to bother you when busy', 'おいそがしいところきょうしゅくですが', 'Sonkeigo', 'お忙しいところ恐縮ですが、ご確認のほどよろしくお願いいたします。'],
                    ['ご確認ください', 'Please confirm/check', 'ごかくにんください', 'Sonkeigo', '添付ファイルをご確認ください。'],
                    ['何卒よろしくお願い申し上げます', 'Kindly request your cooperation (very formal)', 'なにとぞよろしくおねがいもうしあげます', 'Kenjougo', '以上、何卒よろしくお願い申し上げます。'],
                    ['取り急ぎご連絡いたします', 'Quick message to inform you', 'とりいそぎごれんらくいたします', 'Kenjougo', '取り急ぎご連絡いたします。詳細は後日お送りいたします。'],
                    ['敬具', 'Formal closing (letters)', 'けいぐ', 'Teineigo', 'ご確認のほどよろしくお願いいたします。敬具'],
                ],
            ],
            [
                'title' => 'Telephone Call Manners',
                'scenario_tag' => 'Telephone Calls',
                'jlpt_level' => 'N4',
                'description' => 'Essential phrases for answering and making business phone calls.',
                'cards' => [
                    ['お電話ありがとうございます', 'Thank you for calling', 'おでんわありがとうございます', 'Teineigo', 'お電話ありがとうございます、株式会社トビラでございます。'],
                    ['少々お待ちください', 'Please wait a moment', 'しょうしょうおまちください', 'Sonkeigo', '担当の者におつなぎしますので、少々お待ちください。'],
                    ['折り返しお電話いたします', 'I will call you back', 'おりかえしおでんわいたします', 'Kenjougo', 'ただいま席を外しておりますので、折り返しお電話いたします。'],
                    ['お名前を伺ってもよろしいでしょうか', 'May I ask your name', 'おなまえをうかがってもよろしいでしょうか', 'Sonkeigo', '恐れ入りますが、お名前を伺ってもよろしいでしょうか。'],
                    ['失礼いたします', 'Excuse me (polite closing)', 'しつれいいたします', 'Kenjougo', 'それでは失礼いたします。'],
                    ['お電話代わりました', 'I have taken over the call', 'おでんわかわりました', 'Teineigo', 'お電話代わりました、営業部の田中でございます。'],
                ],
            ],
            [
                'title' => 'Office Daily Use',
                'scenario_tag' => 'Office Daily Use',
                'jlpt_level' => 'N5',
                'description' => 'Everyday workplace vocabulary for greetings and routine tasks.',
                'cards' => [
                    ['おはようございます', 'Good morning (polite)', 'おはようございます', 'Teineigo', 'おはようございます。今日もよろしくお願いします。'],
                    ['お先に失礼します', 'Excuse me for leaving first', 'おさきにしつれいします', 'Teineigo', 'お先に失礼します。お疲れ様でした。'],
                    ['会議室', 'Meeting room', 'かいぎしつ', 'Teineigo', '会議室は3階にございます。'],
                    ['休憩', 'Break / rest', 'きゅうけい', 'Teineigo', 'そろそろ休憩を取りましょう。'],
                    ['資料', 'Documents / materials', 'しりょう', 'Teineigo', '会議の資料を準備しておいてください。'],
                    ['お疲れ様です', 'Thank you for your hard work', 'おつかれさまです', 'Teineigo', 'お疲れ様です。今日はありがとうございました。'],
                ],
            ],
        ];

        foreach ($decks as $deckData) {
            $deck = Deck::create([
                'user_id' => $owner->id,
                'title' => $deckData['title'],
                'scenario_tag' => $deckData['scenario_tag'],
                'jlpt_level' => $deckData['jlpt_level'],
                'is_public' => true,
                'description' => $deckData['description'],
            ]);

            foreach ($deckData['cards'] as [$front, $back, $furigana, $keigo, $context]) {
                Card::create([
                    'deck_id' => $deck->id,
                    'front_text' => $front,
                    'back_text' => $back,
                    'furigana' => $furigana,
                    'keigo_form' => $keigo,
                    'context_sentence' => $context,
                ]);
            }
        }

        $this->command?->info('Seeded 5 decks with 6 cards each (30 cards total).');
    }
}