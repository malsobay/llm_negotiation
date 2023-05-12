// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { ChatCommon } from "./ChatCommon";
import { CHAT_API_PORT, CHAT_SHOW_AI_TYPING_INDICATOR, SIMULATE_AI_RESPONSE_DELAYS } from "./constants";
import { randID } from "./utils";
import useGameMechanics from "./useGameMechanics";

const DEAL_REACHED = "[DEAL REACHED]";
const NO_DEAL = "[NO DEAL]";

const DEAL_ACCEPTED = "[DEAL ACCEPTED]";
const DEAL_REJECTED = "[DEAL REJECTED]";

const NO_DEAL_ACCEPTED = "[NO DEAL ACCEPTED]";
const NO_DEAL_REJECTED = "[NO DEAL REJECTED]";

/** @param {boolean} allowNoDeal */
const proposeDealPrompt = (
  allowNoDeal
) => `When a deal has been reached, output a single line that contains a string ${DEAL_REACHED} and the agreed upon amount, for example "${DEAL_REACHED} $200", if the agreed upon amount is $200.
${
  allowNoDeal
    ? `If you decide an agreement cannot be met and would rather walk away, output a single line with a string ${NO_DEAL}.
`
    : ""
}Do not output any other messages, do not format your response, use ${DEAL_REACHED}${
  allowNoDeal ? ` or ${NO_DEAL}` : ""
} verbatim. Your output will be parsed by a computer.
If the user rejects your proposal, continue negotiating.
If the user wants to continue negotiating, continue negotiating.`;

const receivedDealReachedPrompt = (
  price
) => `The user has proposed a deal of $${price}. If you accept, output a single line with a string ${DEAL_ACCEPTED}.
If you reject, output a single line that contains a string ${DEAL_REJECTED} followed by your negotiation message".
Do not output any other messages, do not format your response, use ${DEAL_ACCEPTED} or ${DEAL_REJECTED} verbatim. Your output will be parsed by a computer.
If you accept the deal, the negotiation ends.
If you reject the deal, continue negotiating.`;

const receivedNoDealPrompt = `The user has decided to walk away from the negotiation. If you accept, output a single line that contains a string ${NO_DEAL_ACCEPTED}.
If you reject, output a single line that contains a string ${NO_DEAL_REJECTED} followed by your negotiation message.
Do not output any other messages, do not format your response, use ${NO_DEAL_ACCEPTED} or ${NO_DEAL_REJECTED} verbatim. Your output will be parsed by a computer.
If you accept the no deal, the negotiation ends.
If you reject the no deal, continue negotiating.`;

/**
 * @param {string} message
 * @returns {| {
 *       type: "message";
 *       text: string;
 *     }
 *   | {
 *       type: "proposal";
 *       text: string;
 *       proposal: number;
 *     }
 *   | {
 *       type: "no-deal";
 *       text: string;
 *     }
 *   | {
 *       type: "deal-accepted";
 *       text: string;
 *     }
 *   | {
 *       type: "deal-rejected";
 *       text: string;
 *     }
 *   | {
 *       type: "no-deal-accepted";
 *       text: string;
 *     }
 *   | {
 *       type: "no-deal-rejected";
 *       text: string;
 *     }}
 */
const extractMessageProposal = (message) => {
  const hasProposal = message.includes(DEAL_REACHED);
  const hasNoDeal = message.includes(NO_DEAL);
  const hasDealAccepted = message.includes(DEAL_ACCEPTED);
  const hasDealRejected = message.includes(DEAL_REJECTED);
  const hasNoDealAccepted = message.includes(NO_DEAL_ACCEPTED);
  const hasNoDealRejected = message.includes(NO_DEAL_REJECTED);

  if (hasProposal) {
    const messageSplit = message.split(DEAL_REACHED);
    const proposal = messageSplit[1].trim();

    // Sometimes LLM outputs a message before a proposal
    const messageWithoutProposal = messageSplit[0].trim();

    const hasDollarSign = proposal.includes("$");

    if (hasDollarSign) {
      const amount = proposal.split("$")[1].trim();

      return {
        type: "proposal",
        text: messageWithoutProposal,
        proposal: parseInt(amount),
      };
    } else {
      // Bail out if we have a deal reached but no dollar sign
      return {
        type: "message",
        text: messageWithoutProposal,
      };
    }
  } else if (hasNoDeal) {
    const messageSplit = message.split(NO_DEAL);

    // Sometimes LLM outputs a text message before a no deal message
    const messageWithoutNoDeal = messageSplit[0].trim();

    return {
      type: "no-deal",
      text: messageWithoutNoDeal,
    };
  } else if (hasDealAccepted) {
    return {
      type: "deal-accepted",
      text: "",
    };
  } else if (hasDealRejected) {
    const messageSplit = message.split(DEAL_REJECTED);

    // LLM can follow up a deal rejected with a message
    const messageWithoutDealRejected = messageSplit[1].trim();

    return {
      type: "deal-rejected",
      text: messageWithoutDealRejected,
    };
  } else if (hasNoDealAccepted) {
    return {
      type: "no-deal-accepted",
      text: "",
    };
  } else if (hasNoDealRejected) {
    const messageSplit = message.split(NO_DEAL_REJECTED);

    // LLM can follow up a no deal rejected with a message
    const messageWithoutNoDealRejected = messageSplit[1].trim();

    return {
      type: "no-deal-rejected",
      text: messageWithoutNoDealRejected,
    };
  } else {
    return {
      type: "message",
      text: message,
    };
  }
};

const getLlmNoDealBehavior = (game) => {
  const { firstPlayerNoDeal, secondPlayerNoDeal, llmStartsFirst } =
    game.get("treatment");

  const playerNoDeal = llmStartsFirst ? firstPlayerNoDeal : secondPlayerNoDeal;

  const allowNoDeal = playerNoDeal !== "not-allowed";
  const unilateralNoDeal = playerNoDeal === "allowed-unilateral";

  return {
    allowNoDeal,
    unilateralNoDeal,
  };
};

async function randomDelay(minSecs, maxSecs) {
  const delaySecs = Math.random() * (maxSecs - minSecs) + minSecs;
  const delayMillis = delaySecs * 1000;

  return new Promise((resolve) => setTimeout(resolve, delayMillis));
}

/**
 * Simulate a human response delay based on the number of words in the message.
 *
 * @param {string} message
 * @param {number} [factor=1] Default is `1`
 */
async function simulateHumanResponseDelay(message, factor = 1) {
  const wordsCnt = message.split(" ").length;
  await randomDelay((wordsCnt / 4) * factor, (wordsCnt / 2) * factor);
}

export function ChatWithLLM({ game, player, players, stage, round }) {
  const playerId = player.id;
  const assistantPlayerId = `${player.id}-assistant`;

  const { llmPromptRole, llmDemeanor, llmStartsFirst } = game.get("treatment");
  const { allowNoDeal, unilateralNoDeal } = getLlmNoDealBehavior(game);
  const llmPrompt = player.get("llmInstructions");

  const { messages, setMessages, endWithDeal, endWithNoDeal, switchTurns } =
    useGameMechanics();

  const [llmTyping, setLlmTyping] = useState(false);
  const latestLlmRespondsToMessage = useRef(undefined);

  /** @param {any[]} messages */
  function convertChatToOpenAIMessages(messages) {
    const mappedMessages = messages.map((message) => {
      const { type, agentType, text } = message;
      return {
        role: agentType,
        content:
          type === "proposal"
            ? `Proposed a deal: $${message.proposal}`
            : type === "no-deal"
            ? `Proposed to end without a deal`
            : text,
      };
    });
    mappedMessages.unshift({
      role: llmPromptRole,
      content: `${llmPrompt}. Your demeanor should be ${llmDemeanor}.`,
    });

    const lastMessage =
      messages.length > 0 ? messages[messages.length - 1] : undefined;

    const hasUserProposedDeal =
      lastMessage &&
      lastMessage.agentType === "user" &&
      lastMessage.type === "proposal";
    const hasUserProposedNoDeal =
      lastMessage &&
      lastMessage.agentType === "user" &&
      lastMessage.type === "no-deal";

    if (hasUserProposedDeal) {
      mappedMessages.push({
        role: llmPromptRole,
        content: receivedDealReachedPrompt(lastMessage.proposal),
      });
    } else if (hasUserProposedNoDeal) {
      mappedMessages.push({
        role: llmPromptRole,
        content: receivedNoDealPrompt,
      });
    } else {
      mappedMessages.push({
        role: llmPromptRole,
        content: proposeDealPrompt(allowNoDeal),
      });
    }

    return mappedMessages;
  }

  async function getChatResponse(messages) {
    const apiUrl = `http://localhost:${CHAT_API_PORT}/chat`;

    const openAIMessages = convertChatToOpenAIMessages(messages);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: openAIMessages,
        temperature: game.get("treatment").llmTemperature,
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Chat API returned status ${response.status}`);
    }

    const { chatResponse } = await response.json();

    return chatResponse;
  }

  const executeLlmTurn = async (messagesWithUserMessage) => {
    try {
      const llmRespondsToMessage =
        messagesWithUserMessage[messagesWithUserMessage.length - 1];
      latestLlmRespondsToMessage.current = llmRespondsToMessage;

      if (SIMULATE_AI_RESPONSE_DELAYS) {
        await simulateHumanResponseDelay(
          llmRespondsToMessage?.text || llmPrompt
        );
      }

      if (latestLlmRespondsToMessage.current !== llmRespondsToMessage) {
        // Aborting the attempt if the user has sent a new message
        return;
      }

      setLlmTyping(true);
      const chatResponse = await getChatResponse(messagesWithUserMessage);

      if (SIMULATE_AI_RESPONSE_DELAYS) {
        // Use a shorter delay for the LLM response as it is already
        // delayed by the API response time
        await simulateHumanResponseDelay(chatResponse, 0.5);
      }

      if (latestLlmRespondsToMessage.current !== llmRespondsToMessage) {
        // Discard the result if the user has sent a new message
        return;
      }

      const extracted = extractMessageProposal(chatResponse);

      const messageCommon = {
        text: extracted.text,
        originalText: chatResponse,
        playerId: `${player.id}-assistant`,
        gamePhase: `Round ${round.index} - ${stage.name}`,
        id: randID(),
        timestamp: Date.now(),
        agentType: "assistant",
      };

      const messagesWithLLMResponse = [...messagesWithUserMessage];
      const lastMessage =
        messagesWithLLMResponse[messagesWithLLMResponse.length - 1];

      if (extracted.type === "proposal") {
        messagesWithLLMResponse.push({
          ...messageCommon,
          type: "proposal",
          proposal: extracted.proposal,
          proposalStatus: "pending",
        });
      } else if (extracted.type === "no-deal") {
        messagesWithLLMResponse.push({
          ...messageCommon,
          type: "no-deal",
          noDealStatus: "pending",
        });
      } else if (extracted.type === "deal-accepted") {
        lastMessage.proposalStatus = "accepted";
      } else if (extracted.type === "deal-rejected") {
        lastMessage.proposalStatus = "rejected";

        messagesWithLLMResponse.push({
          ...messageCommon,
          type: "message",
        });
      } else if (extracted.type === "no-deal-rejected") {
        lastMessage.noDealStatus = "rejected";

        messagesWithLLMResponse.push({
          ...messageCommon,
          type: "message",
        });
      } else if (extracted.type === "no-deal-accepted") {
        lastMessage.noDealStatus = "ended";
      } else {
        messagesWithLLMResponse.push({
          ...messageCommon,
          type: "message",
        });
      }

      setMessages(messagesWithLLMResponse);

      // TODO: unify this with the code in ChatCommon
      if (extracted.type === "deal-accepted") {
        endWithDeal(lastMessage.proposal);
      } else if (
        extracted.type === "no-deal-accepted" ||
        (extracted.type === "no-deal" && unilateralNoDeal)
      ) {
        endWithNoDeal();
      } else {
        switchTurns();
      }
    } catch (err) {
      // Make sure that the turn is returned to the player if there is an error
      switchTurns();
      console.error(err);
      return;
    }

    setLlmTyping(false);
  };

  const onNewMessage = async (newMessageText) => {
    const text = newMessageText.trim();

    if (text.length === 0) {
      return;
    }

    /** @type {import("./useGameMechanics").Message} */
    const newMessage = {
      type: "message",
      text,
      playerId,
      gamePhase: `Round ${round.index} - ${stage.name}`,
      id: randID(),
      timestamp: Date.now(),
      agentType: "user",
    };

    const messagesWithUserMessage = [...messages, newMessage];
    setMessages(messagesWithUserMessage);

    switchTurns();

    // We don't await the LLM turn here because we want to return control to the player
    // as soon as possible when out of order messages are allowed.
    // When out of order messages are not allowed, this will be handled by the
    // turns mechanism in useGameMechanics.
    void executeLlmTurn(messagesWithUserMessage);
  };

  const onNewProposalOrNoDeal = async () => {
    await executeLlmTurn(messages);
  };

  const isFirstTurn = messages.length === 0;

  useEffect(() => {
    if (isFirstTurn && llmStartsFirst) {
      executeLlmTurn(messages);
    }
  }, [isFirstTurn, llmStartsFirst]);

  return (
    <ChatCommon
      game={game}
      player={player}
      players={players}
      round={round}
      stage={stage}
      onNewMessage={onNewMessage}
      onNewProposal={onNewProposalOrNoDeal}
      onNewNoDeal={onNewProposalOrNoDeal}
      otherPlayerTyping={CHAT_SHOW_AI_TYPING_INDICATOR && llmTyping}
    />
  );
}
