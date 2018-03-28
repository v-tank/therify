// @flow
import * as _ from "lodash";
import autobind from "autobind-decorator";
import * as React from "react";
import {observable, action} from "mobx";
import {inject} from "mobx-react/native";
import {Animated, Dimensions} from "react-native";
import {Audio} from "expo";

import type {PlaybackStatus} from "expo/src/av/AV";
import type {ThemeProps} from "../../components";
import type {Playlist, PlaylistEntry} from "../api";

type CompositeAnimation = {
    start: () => void,
    stop: () => void
};

export default class Player {

    progressAnimation: CompositeAnimation;
    sound: Audio.Sound;
    durationLeftMillis = 0;

    @observable sliding: Animated.Value = new Animated.Value(64);
    @observable progress: Animated.Value = new Animated.Value(0);

    @observable playlist: ?Playlist;
    @observable playlistEntry: ?PlaylistEntry;

    @observable isLoaded = false;
    @observable isPlaying = false;
    @observable locked = false;
    @observable volume = 0;

    @action lock() { this.locked = true; }
    @action unlock() { this.locked = false; }
    @action resetProgress() { this.progress = new Animated.Value(0); }

    async play(playlist: Playlist, playlistEntry: PlaylistEntry): Promise<void> {
        if (!this.locked) {
            this.load(playlist, playlistEntry);
        }
    }

    @action
    async load(playlist: Playlist, playlistEntry: PlaylistEntry): Promise<void> {
        this.lock();
        const {uri} = playlistEntry.track;
        Animated.timing(this.sliding, { duration: 300, toValue: 0, useNativeDriver }).start();
        this.playlist = playlist;
        this.playlistEntry = playlistEntry;
        if (this.sound) {
            this.resetProgress();
            await this.sound.unloadAsync();
        }
        const {sound, status} = await Audio.Sound.create({ uri }, { shouldPlay: true }, this.statusUpdate, false);
        this.sound = sound;
        if (status.durationMillis) {
            const duration = status.durationMillis;
            this.progressAnimation = Animated.timing(this.progress, { duration, toValue: width, useNativeDriver });
            this.progressAnimation.start();
        }
    }

    async shuffle(playlist: Playlist): Promise<PlaylistEntry> {
        const selectedEntry = _.sample(playlist.entries.filter(entry => !this.isSongPlaying(playlist, entry)));
        await this.play(playlist, selectedEntry);
        return selectedEntry;
    }

    isPlaylistPlaying(playlist: Playlist): boolean {
        return this.isPlaying && this.playlist != null && this.playlist.id === playlist.id;
    }

    isSongPlaying(playlist: Playlist, playlistEntry: PlaylistEntry): boolean {
        return this.playlist != null && this.playlistEntry != null && playlist.id === this.playlist.id &&
         this.playlistEntry.track.uri === playlistEntry.track.uri;
    }

    @autobind
    async toggle(): Promise<void> {
        if (this.isPlaying) {
            await this.sound.pauseAsync();
            this.progressAnimation.stop();
        } else {
            await this.sound.playAsync();
            const duration = this.durationLeftMillis;
            this.progressAnimation = Animated.timing(this.progress, { duration, toValue: width, useNativeDriver });
            this.progressAnimation.start();
        }
    }

    @autobind @action
    statusUpdate(status: PlaybackStatus) {
        this.isLoaded = status.isLoaded;
        if (status.isLoaded) {
            this.volume = status.volume;
            this.isLoaded = !status.isBuffering;
            this.isPlaying = status.isPlaying;
            if (this.isLoaded && this.locked) {
                this.unlock();
            }
            if (status.durationMillis) {
                this.durationLeftMillis = status.durationMillis - status.positionMillis;
            }
            if (status.didJustFinish) {
                this.resetProgress();
                this.sliding = new Animated.Value(64);
                this.playlist = undefined;
                this.playlistEntry = undefined;
            }
        }
    }
}

export type PlayerProps = {
    player: Player
};

// eslint-disable-next-line max-len
export function withPlayer<Props: {}, Comp: React.ComponentType<Props>>(C: Comp): React.ComponentType<$Diff<React.ElementConfig<Comp>, PlayerProps>> {
    return inject("player")(C);
}

// eslint-disable-next-line max-len
export function withPlayerAndTheme<Props: {}, Comp: React.ComponentType<Props>>(C: Comp): React.ComponentType<$Diff<React.ElementConfig<Comp>, PlayerProps & ThemeProps>> {
    return inject("player", "theme")(C);
}

const useNativeDriver = true;
const {width} = Dimensions.get("window");
