import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType
} from "discord-api-types/v10";

import { otters } from "./otters";
import { verify } from "./verify";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const reply = (response: APIInteractionResponse) =>
  new Response(JSON.stringify(response), { headers: { "content-type": "application/json" } });

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!request.headers.get("X-Signature-Ed25519") || !request.headers.get("X-Signature-Timestamp"))
      return Response.redirect("https://commandtechno.com");

    if (!(await verify(request))) return new Response("", { status: 401 });

    const interaction = (await request.json()) as APIPingInteraction | APIApplicationCommandInteraction;
    if (interaction.type === InteractionType.Ping) return reply({ type: InteractionResponseType.Pong });

    const otter = otters[Math.floor(Math.random() * otters.length)];
    return reply({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            url: otter.link,
            color: 0x2f3136,
            title: `🦦 ${otter.title}`,
            image: { url: otter.img },
            timestamp: otter.pubDate,
            footer: {
              text: "Made by Commandtechno#0841",
              icon_url: "https://commandtechno.com/assets/avatar.gif"
            }
          }
        ]
      }
    });
  }
};
