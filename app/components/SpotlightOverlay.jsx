import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import Text from './AppText';
import TitleText from './TitleText';
import { useLanguage } from '../contexts/LanguageContext';
import { floatingCard } from '../styles/shadows';

const CUTOUT_PADDING = 8;
const CUTOUT_RADIUS = 14;
const TOOLTIP_MARGIN = 16;

export default function SpotlightOverlay({ visible, steps, onFinish }) {
  const { t } = useLanguage();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [stepIndex, setStepIndex] = useState(0);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [visible]);

  const step = steps[stepIndex];

  useEffect(() => {
    if (!visible || !step) return undefined;

    const target = step.getTarget?.();
    if (!target?.measureInWindow) {
      setBounds(null);
      return undefined;
    }

    const raf = requestAnimationFrame(() => {
      target.measureInWindow((x, y, width, height) => {
        setBounds({ x, y, width, height });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [visible, stepIndex, step]);

  if (!visible || !step) return null;

  const isLastStep = stepIndex === steps.length - 1;

  const cutout = bounds && {
    x: bounds.x - CUTOUT_PADDING,
    y: bounds.y - CUTOUT_PADDING,
    width: bounds.width + CUTOUT_PADDING * 2,
    height: bounds.height + CUTOUT_PADDING * 2,
  };

  const placeBelow = !cutout || cutout.y + cutout.height / 2 < screenHeight / 2;
  const tooltipPosition = cutout
    ? placeBelow
      ? { top: cutout.y + cutout.height + TOOLTIP_MARGIN }
      : { bottom: screenHeight - cutout.y + TOOLTIP_MARGIN }
    : { top: screenHeight / 2 - 90 };

  const goNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setStepIndex((index) => index + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFinish}>
      <View style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => {}} />

        <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <Mask id="spotlight-mask">
              <Rect x={0} y={0} width={screenWidth} height={screenHeight} fill="#ffffff" />
              {cutout && (
                <Rect
                  x={cutout.x}
                  y={cutout.y}
                  width={cutout.width}
                  height={cutout.height}
                  rx={CUTOUT_RADIUS}
                  fill="#000000"
                />
              )}
            </Mask>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={screenWidth}
            height={screenHeight}
            fill="#000000"
            opacity={0.75}
            mask="url(#spotlight-mask)"
          />
        </Svg>

        {cutout && (
          <Pressable
            style={[
              styles.cutoutTouchable,
              { left: cutout.x, top: cutout.y, width: cutout.width, height: cutout.height },
            ]}
            onPress={goNext}
          />
        )}

        <View style={[styles.tooltip, tooltipPosition]}>
          <TitleText style={styles.tooltipTitle}>{step.title}</TitleText>
          <Text style={styles.tooltipBody}>{step.description}</Text>

          <View style={styles.dots}>
            {steps.map((dotStep, index) => (
              <View key={dotStep.id} style={[styles.dot, index === stepIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onFinish}>
              <Text style={styles.skipText}>{t('tutorial.skip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={goNext}>
              <Text style={styles.nextButtonText}>
                {isLastStep ? t('tutorial.getStarted') : t('tutorial.next')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cutoutTouchable: {
    position: 'absolute',
  },
  tooltip: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    ...floatingCard,
  },
  tooltipTitle: {
    fontSize: 18,
    color: '#0a445c',
    marginBottom: 8,
  },
  tooltipBody: {
    fontSize: 14,
    color: '#254952',
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d3dcdc',
  },
  dotActive: {
    backgroundColor: '#46a3a4',
    width: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 14,
    color: '#6b8788',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    backgroundColor: '#c6a2ba',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
