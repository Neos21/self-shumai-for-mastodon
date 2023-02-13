import MarkovChain from 'npm:@hideokamoto/markov-chain-tiny@0.1.0';

import { InputEntity } from '../entities/input.ts';
import { OutputEntity } from '../entities/output.ts';

/** Generate Service */
export class GenerateService {
  constructor(private inputEntity: InputEntity, private outputEntity: OutputEntity) { }
  
  /**
   * Generate
   * 
   * @return Markov Text
   * @throws Failed To Find All, Failed To Generate Markov, Failed To Save
   */
  public generate(): string {
    const texts = this.inputEntity.findAll();  // throws
    const text = texts.join('\n');
    const markovText = this.generateMarkov(text);
    this.outputEntity.save(markovText);  // throws
    this.outputEntity.removeOlds();
    return markovText;
  }
  
  /**
   * Generate Markov
   * 
   * @param text Text
   * @return Markov Text
   * @throws Failed To Make Sentence
   */
  private generateMarkov(text: string): string {
    const markov = new MarkovChain(text);
    const sentence = markov.makeSentence();
    console.log(`GenerateService#generateMarkov() : [${sentence}]`);
    return sentence;
  }
}
